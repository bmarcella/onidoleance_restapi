/* eslint-disable default-param-last */
/* eslint-disable camelcase */
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/../../.env') });
const XLSX = require('xlsx');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const bookshelf = require('../../database/config');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const advanced = require('dayjs/plugin/advancedFormat');
const sameOrBefore = require('dayjs/plugin/isSameOrBefore');
const { jsPDF } = require('jspdf');
const { applyPlugin } = require('jspdf-autotable');
applyPlugin(jsPDF);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);
dayjs.extend(sameOrBefore);

class Controller {
  constructor () {
    this.attribs = null;
    this.sort = [];
    this.where = [];
    this.DEBUG_KNEX = false;
    this.round = parseInt(process.env.HASH_TOUR);
  }

  genHash (password, salt) {
    return bcrypt.hashSync(password, salt);
  }

  genSalt () {
    return bcrypt.genSaltSync(Number(this.round));
  }

  compare (data, encrypted) {
    return bcrypt.compareSync(data, encrypted);
  }

  isNumberInteger (value) {
    return Number.isInteger(Number(value))
  }

  isValidNumber (value) {
    return !Number.isNaN(Number(value));
  }

  all (req, res, next) {
    this.attribs = this.attribs || {};
    // uncomment to debug
    // this.attribs.debug = true;

    this.applyRelations(req.query);
    this.applyWhere(req.query);
    this.applyPage(req.query);
    this.applyLimit(req.query);
    this.applySort(req.query);

    new this.Model().query(qb => {
      // where
      this.where.forEach(({ column, operand, value }) => {
        if (value !== null) {
          qb.where(column, operand, value);
        } else if (operand === 'null') {
          qb.whereNull(column);
        } else if (operand === 'notNull') {
          qb.whereNotNull(column);
        }
      });

      // sort
      this.sort.forEach(({ column, order }) => {
        qb.orderBy(column, order);
      });
    })
      .fetchPage(this.attribs)
      .then(results => {
        this.functionResponse(results, res, true, 200)
      })
      .catch(error => {
        const details = this.getErrorDetails(error);
        this.functionResponse(details, res, false, 400);
      });
  }

  find (req, res, next) {
    this.attribs = this.attribs || {};
    // uncomment to debug
    // this.attribs.debug = true;

    this.applyRelations(req.query);

    const id = req.params.id;

    new this.Model({ id })
      .fetch(this.attribs)
      .then((model) => {
        this.functionResponse(model, res, true, 200)
      })
      .catch(error => {
        const details = this.getErrorDetails(error);
        this.functionResponse(details, res, false, 400);
      });
  };

  insert (req, res) {
    const data = req.body;

    // this handle multiple files upload
    // but ONLY 1 file for each field will be used
    if (req.files) {
      // put each filename into corresponding field name
      Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];
        data[file.fieldname] = file.filename;
      });
    }

   

    this.txItemSaver(null, this.Model, data, true)
      .then((result) => {
        this.functionResponse(result, res, true, 201);
      })
      .catch(error => {
        // unlink the files on error
        if (req.files) {
          Object.keys(req.files).forEach(key => {
            const file = req.files[key][0];
            fs.unlinkSync(file.path);
          });
        }

        const details = this.getErrorDetails(error);
        this.functionResponse(details, res, false, 400);
      });
  };

  update (req, res) {
    const id = req.params.id;
    const data = req.body;

    this.txUpdateModel(null, this.Model, [{ key: 'id', value: id }], data, true)
      .then((result) => {
        // Remove old files if any when using multer files upload
        if (req.oldFilepaths) {
          req.oldFilepaths.forEach(path => {
            fs.unlinkSync(path);
          });
        }

        this.functionResponse(result, res, true, 201)
      })
      .catch(error => {
        // unlink the files on error
        if (req.files) {
          Object.keys(req.files).forEach(key => {
            const file = req.files[key][0];
            fs.unlinkSync(file.path);
          });
        }

        const details = this.getErrorDetails(error);
        this.functionResponse(details, res, false, 400);
      });
  };

  delete (req, res) {
    const id = req.params.id;

    this.txDeleteModel(null, this.Model, [{ key: 'id', value: id }], true)
      .then((model) => {
        this.functionResponse(model, res, true, 201);
      })
      .catch(error => {
        const details = this.getErrorDetails(error);
        this.functionResponse(details, res, false, 400);
      });
  };

  applyWhere (query) {
    this.where = [];
    if (!query.where) { return; }
    // where[]=id[.]=[.]1&where[]=code[.]like[.]%dj%
    if (!Array.isArray(query.where)) { return; }
    query.where.forEach((item) => {
      const trio = item.split('[.]');
      if (trio.length === 3) {
        this.where.push({
          column: trio[0],
          operand: trio[1],
          value: trio[1] === 'between' ? trio[2].split(',') : trio[2]
        })
      }
    })
  }

  applySort (query) {
    this.sort = [];
    if (!query.sort) {
      return;
    }

    // Multiple sorting
    // ?sort=first_name.desc,last_name.desc
    const parts = query.sort.split(',');
    parts.forEach(part => {
      const kv = part.split('.');
      if (kv.length > 1) {
        this.sort.push({
          column: kv[0],
          order: kv[1]
        });
      }
    });
  }

  applyPage (query, attribs) {
    this.page = query.page || 1;
    this.pageSize = query.pageSize || 20;

    this.attribs.page = this.page;
    this.attribs.pageSize = this.pageSize;
  }

  applyLimit (query, attribs) {
    if (query.limit || query.offset) {
      this.limit = query.limit || 20;
      this.offset = query.offset || 0;

      this.attribs.limit = this.limit;
      this.attribs.offset = this.offset;
    }
  }

  applyRelations (query) {
    if (!query.relations) {
      return;
    }

    // remove all relations if false
    if (query.relations === 'false') {
      delete this.attribs.withRelated;
      return;
    }

    // Cascade Relation support
    // ?relations=user,posts.comments
    const relations = query.relations.split(',');
    relations.forEach(relation => {
      this.attribs.withRelated = this.attribs.withRelated || [];
      this.attribs.withRelated.push(relation);
    });
  }

  getErrorDetails (error) {
    const details = {};
    if (error.message) {
      details.message = error.sqlMessage ? error.sqlMessage : error.message;
      details.stack = error.stack;
      details.code = `${error.errno || ''}:${error.code || ''}`
    }

    if (error.response && !details.message) {
      details.message = error.response.message;
    }

    return details;
  }

  // create method to generate code for ticket
  codeGenerator () {
    let strStart = '';
    const args = [].concat(...arguments)
    if (args.length) {
      strStart += args.reduce((a, b, index) => {
        return `${a}-${b}`;
      })
    }

    const currentTimeStamp = Date.now().toString();
    const stampCode = currentTimeStamp.slice(currentTimeStamp.length - 2)
    const randValue = Math.random().toString(6).slice(2, 6);
    const keycode = strStart.length ? `${strStart}-${stampCode}${randValue}` : `${stampCode}${randValue}`;

    return keycode;
  }

  currentServerDateTime () {
    // return dayjs.tz().local().format();
    const dateDime = dayjs.tz().local().format();
    const spliter = dateDime.split('T');
    const dateD = spliter[0];
    const timeT = spliter[1].substring(0, 8);
    // 2022-07-17T15:36:18-04:00
    return `${dateD} ${timeT}`;
  }

  functionResponse (result, res, successValue = true, code = 201) {
    res.status(code).send({
      result: successValue ? result : null,
      server_datetime: this.currentServerDateTime(),
      success: successValue,
      pagination: result ? result.pagination : null,
      message: successValue ? 'success' : result.message,
      error: successValue ? null : result
    });
  }

  sqlQuery(queryStr, bindParams, t){
    if(t){
      return bookshelf.knex.raw(queryStr, bindParams).transacting(t);
    }

    return bookshelf.knex.raw(queryStr, bindParams);
  }

  txItemSaver (t, Model, obj, requireCond = false) {
    return new Model()
      .save(
        { ...obj, created_at: this.currentServerDateTime(), updated_at: this.currentServerDateTime() },
        { method: 'insert', transacting: t, debug: this.DEBUG_KNEX, require: requireCond })
  }

  knexUpdaterFunc (t, model, obj, requireCond = false) {
    return model
      .save({ ...obj, updated_at: this.currentServerDateTime() }, { transacting: t, patch: true, debug: this.DEBUG_KNEX, require: requireCond })
  }

  txDeleteModel (t, Model, arr = [], requireCond = true) {
    if (!arr.length) { throw new Error('ERROR: DESTROY[093]') }
    return new Model().query(qb => {
      arr.forEach((item) => {
        if (item.middle) {
          qb.where(item.key, item.middle, item.value);
        } else {
          qb.where(item.key, item.value);
        }
      })
    })
      .destroy({ transacting: t, debug: this.DEBUG_KNEX, require: requireCond })
  };
  functionError(error, res, type = 'result'){

    const details = this.getErrorDetails(error);

    res.status(400).send({
      [type]: null,
      server_datetime: this.currentServerDateTime(),
      success: false,
      pagination: null,
      message: details.message,
      error: details
    });
  }
  functionSuccess(result, res, pagination, type = 'result'){

    res.status(201).send({
      [type]: result,
      server_datetime: this.currentServerDateTime(),
      success: true,
      pagination: result? (result.pagination || pagination) : null,
      message: "Success",
      error: null
    });
  }

  txUpdateModel (t, Model, arr = [], obj, requireCond = true) {
    if (!arr.length) { throw new Error('ERROR: UPDATE[083]') }
    return new Model().query((qb) => {
      arr.forEach((item) => {
        if (item.middle) {
          qb.where(item.key, item.middle, item.value);
        } else {
          qb.where(item.key, item.value);
        }
      })
    }).save({ ...obj, updated_at: this.currentServerDateTime() }, { patch: true, transacting: t, debug: this.DEBUG_KNEX, require: requireCond });
  };

  txBulkSaver (t, model, arr = [], requireCond = false) {
    return model.collection(arr)
      .invokeThen('save', null, { method: 'insert', transacting: t, debug: this.DEBUG_KNEX, require: requireCond })
  }

  txBulkUpdater (t, model, arr = [], requireCond = false) {
    // fetchAllUserWallet
    return model
      .collection(arr)
      .invokeThen('save', null, { method: 'update', transacting: t, debug: this.DEBUG_KNEX, require: requireCond })
  }

  txDataFetcher (t, model, queryArray = [], orderByList = [], requireCond = true, withRelated = []) {
    return model.query((qb) => {
      queryArray.forEach((item) => {
        if (item.middle) {
          qb.where(item.key, item.middle, item.value);
        } else {
          qb.where(item.key, item.value);
        }
      });
      orderByList.forEach((item) => {
        qb.orderBy(item.key, item.value);
      });
    }).fetch({ debug: this.DEBUG_KNEX, transacting: t, require: requireCond, withRelated: withRelated })
  }

  txDataFetchAll (t, model, queryArray = [], orderByList = [], requireCond = true, joinArray = [], withRelated = []) {
    return model.query((qb) => {
      joinArray.forEach((item) => {
        qb.join(item.key, item.middle, item.value);
      })

      queryArray.forEach((item) => {
        if (item.middle) {
          qb.where(item.key, item.middle, item.value);
        } else {
          qb.where(item.key, item.value);
        }
      });

      orderByList.forEach((item) => {
        qb.orderBy(item.key, item.value);
      });
    }).fetchAll({ debug: true, transacting: t, require: requireCond, withRelated: withRelated })
  }

  txDataFetchPage (t, model, queryArray = [], orderByList = [], { page = 1, pageSize = 10, debugMod = false, requireCond = false, withRelated = [] }) {
    return model.query((qb) => {
      queryArray.forEach((item) => {
        if (item.middle) {
          qb.where(item.key, item.middle, item.value);
        } else if (item.key === 'RAW_KEY') {
          qb.where(item.value)
        } else {
          qb.where(item.key, item.value);
        }
      });

      orderByList.forEach((item) => {
        qb.orderBy(item.key, item.value);
      });
    }).fetchPage({
      page: page,
      pageSize: pageSize,
      debug: debugMod,
      transacting: t,
      require: requireCond,
      withRelated: withRelated
    })
  }

  handleModulAccess (modulArr, moduleCode, option = 'read', errorCode = 'MOD-ACC-002') {
    const currentPermission = modulArr.find((item) => item.code === moduleCode);
    if (!currentPermission) { throw new Error(`You don't have access to current module: ${moduleCode}. ${errorCode}`) }
    if (currentPermission[`${option}`] !== 1) { throw new Error(`You don't have permission to ${option} on this module. ${errorCode}`) }
    return true;
  }

  xlxsToJsonConverter (filePath, getAllSheet = false, sheetPosition = 0) {
    /**
     * HELPER LINK
     * https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv
     */
    const workbook = XLSX.readFile(filePath);
    const sheetNameList = workbook.SheetNames;

    const dataSheetList = [];
    (sheetNameList || []).forEach((currentSheet, position) => {
      const worksheet = workbook.Sheets[currentSheet];
      const getSheetData = XLSX.utils.sheet_to_json(worksheet)

      if (getAllSheet) { dataSheetList.push(getSheetData); }
      if (!getAllSheet && position === Number(sheetPosition)) { dataSheetList.push(getSheetData); }
    });

    return dataSheetList.flat(1);
  }

  base64FileEncoder (fileStr) {
    if (!fileStr) { return null; }
    const bitmap = fs.readFileSync(fileStr, 'base64');
    return bitmap;
  }

  bulletinGenerator (arr = []) {
    const dirFile = path.join(__dirname, '../../', 'public/files/TempBulletin');
    const fileName = `${this.codeGenerator('BULL')}.pdf`;
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    doc.setProperties({
      title: `Bulletins ${fileName}`,
      subject: 'Bulletins CUFR Généré automatiquement',
      author: 'cufr',
      keywords: 'generated, cufr',
      creator: 'cufr'
    });

    (arr || []).forEach((item, position) => {
      if (position !== 0) { doc.addPage(); } // doc.text('Hello, ', 10, 10)

      this.getBulletinHeader(doc, item.academicYear.start, item.academicYear.end);
      this.getBulletinBodyStudent(doc, {
        firstname: `${item.students.first_name}`.trim(),
        lastname: `${item.students.last_name}`.trim().toUpperCase(),
        classe: `${item.classes.name} ${![16, 17].includes(item.classes.id) ? item.sections.name : ''}`.trim(),
        currentSession: `${item.moyenneSessions[0].academicSession.name}`.trim(),
        absence: item.studentRapportSession ? item.studentRapportSession[0].absence : 0,
        retard: item.studentRapportSession ? item.studentRapportSession[0].retard : 0,
        discipline: item.studentRapportSession ? item.studentRapportSession[0].discipline : 0
      });

      this.generateBulletinTable(doc, item.academicExamStudents, 43);
      this.generateFooterBulletinTable(doc, item.moyenneSessions[0], doc.lastAutoTable.finalY, item.classes.category);
      this.generateBulletinFooter(doc, doc.lastAutoTable.finalY + 4, { current_periode: 1, categoriClasse: item.classes.category });
    })

    doc.save(path.join(dirFile, fileName))
    return fileName;
  }

  getBulletinHeader (doc, startYear, endYear) {
    const logoFile = path.join(__dirname, '../', 'logo', 'logo-cufr.png');
    const imageLogo = this.base64FileEncoder(logoFile);
    // doc.addImage('../logo/logo-cufr.png', 'png', 15, 40, 50, 50, 'logo', 'FAST');

    // custom font : https://stackoverflow.com/questions/26908266/custom-font-faces-in-jspdf https://www.devlinpeck.com/content/jspdf-custom-font
    doc.setFillColor(255, 255, 255); // 19, 21, 69
    doc.rect(0, 0, 250, 27, 'F');
    doc.text('', 105, 0)
    doc.setFontSize(16);
    doc.setFont('roboto', 'bold');
    doc.setTextColor(144, 117, 9);// 241, 196, 15 236, 145, 9
    if (imageLogo) { doc.addImage(imageLogo, 'png', 6, 6, 20, 20, 'logo', 'FAST'); }
    doc.text('COLLÈGE UNIVERS FRÈRE RAPHAËL', 105, 7, null, null, 'center');
    doc.setFontSize(10);
    doc.setFont('roboto', 'normal');
    doc.setTextColor(0, 0, 0); // 255, 255, 255
    doc.text('43, Ruelle Lafleur, Carrefour Truitier, (+509 3666-9484)', 105, 13, null, null, 'center');
    doc.setFontSize(13);
    doc.text('BULLETIN SCOLAIRE', 105, 20, null, null, 'center');
    doc.text(`Année Académique ${startYear}-${endYear}`, 105, 25, null, null, 'center');
    doc.setFontSize(11);

    doc.setLineWidth(1);
    doc.line(0, 27, 250, 27);
  }

  getBulletinBodyStudent (doc, { firstname, lastname, classe, currentSession = '', absence = 0, retard = 0, discipline = 0 }) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('roboto', 'bold');
    doc.text('PRÉNOM(S)', 10, 33);
    doc.text(':', 40, 33);
    doc.setFont('roboto', 'normal');
    doc.text(firstname, 50, 33);

    doc.setFont('roboto', 'bold');
    doc.text('NOM', 10, 38);
    doc.text(':', 40, 38);
    doc.setFont('roboto', 'normal');
    doc.text(lastname, 50, 38);

    doc.setFont('roboto', 'bold');
    doc.text('CLASSE', 10, 43);
    doc.text(':', 40, 43);
    doc.setFont('roboto', 'normal');
    doc.text(classe, 50, 43);

    doc.setFont('roboto', 'bold');
    doc.text('CONTRÔLE :', 100, 43);
    doc.setFont('roboto', 'normal');
    doc.text(currentSession, 130, 43);

    doc.setFont('roboto', 'bold');
    doc.text('Discipline    : ', 160, 33);
    doc.setFont('roboto', 'normal');
    doc.text(`${discipline}`, 190, 33);

    doc.setFont('roboto', 'bold');
    doc.text('Retard(s)     : ', 160, 38);
    doc.setFont('roboto', 'normal');
    doc.text(`${retard}`, 190, 38);

    doc.setFont('roboto', 'bold');
    doc.text('Absence(s)   : ', 160, 43);
    doc.setFont('roboto', 'normal');
    doc.text(`${absence}`, 190, 43);

    // doc.setLineWidth(0.2);
    // doc.line(0, 44, 130, 44);
  }

  generateBulletinTable (doc, arr, startY) {
    // const groupCoupon = this.lodashGrouper(couponList, 'parrain_id', 'coupons');

    const groupCategoryObj = _.chain(arr)
      .sortBy('acyearexam_id')
      .map((itemExam, key) => ({
        category: itemExam.academicYearExams.exam.subject.categorysubject.name,
        content: [
          `   ${itemExam.academicYearExams.exam.name}`,
          Number((itemExam.point_total || 0).toFixed(2)),
          `${Number((itemExam.academicYearExams.coefficient || 0).toFixed(2))}`
        ]
      }))
      .groupBy('category')
      .value();

    const keyList = Object.keys(groupCategoryObj);

    const dataResult = keyList.map((item) => {
      return [[`${item}`]].concat(groupCategoryObj[item].map((items) => items.content));
    }).flat(1);

    doc.autoTable({
      startY: startY + 1,
      headStyles: {
        fillColor: [241, 196, 15],
        fontSize: 12
      },
      head: [['Matières', 'Notes', 'Coéfficients']],
      body: dataResult,
      styles: { overflow: 'linebreak', cellPadding: 0.7 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 33 },
        2: { textColor: [0, 0, 0] }
      },
      didParseCell: function (data) {
        const rawData = data.row.raw;
        if (rawData.length === 1) {
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        } else {
          if (Number(rawData[1]) < Number(rawData[2]) / 2) {
            data.cell.styles.textColor = [231, 76, 60];
          }
        }
      },
      willDrawCell: function (data) {
        if (typeof data.cell.raw === 'string') {
          doc.setTextColor(0, 0, 0);
        }
      }
    })
  }

  generateFooterBulletinTable (doc, obj, startY, category) {
    let minBase = 50;
    if (['Primaire', 'Fondamentale'].includes(category)) { minBase = 5; }

    doc.autoTable({
      startY: startY,
      head: [['TOTAL:', obj.calculus_coeficient, obj.totalpoint_coeficient]],
      body: [['Moyenne:', obj.moyenne_normal, obj.coefficient_moyenne]],
      theme: 'grid',
      styles: { overflow: 'linebreak', fontSize: 11 },
      columnStyles: {
        0: { cellWidth: 90, fontStyle: 'bold', fontSize: 11 },
        1: { cellWidth: 33, fontSize: 11 },
        2: { fontStyle: 'bold', fontSize: 11 }
      },
      willDrawCell: function (data) {
        // console.log(data.cell.styles)
        if (data.cell.raw < minBase) {
          doc.setTextColor(231, 76, 60) // Red
        }
      }
    })
  }

  generateBulletinFooter (doc, xyPosition, { currentPeriode = 1, categoriClasse = '' }) {
    let lastPosition = xyPosition;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    doc.setLineWidth(0.2);
    doc.text('Commentaire:', 20, lastPosition);
    lastPosition += 4;
    doc.line(25, lastPosition, 195, lastPosition);

    lastPosition += 4;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    if (currentPeriode === 3) {
      doc.text('Décision finale :', 120, lastPosition);
    }

    doc.setLineWidth(0.5);
    lastPosition += 6;
    doc.line(15, lastPosition, 100, lastPosition);
    doc.line(120, lastPosition, 195, lastPosition);
    lastPosition += 4;

    doc.text('Signature de la personne responsable', 157, lastPosition, null, null, 'center');
    if (['Primaire', 'Fondamentale'].includes(categoriClasse)) {
      doc.text('Mme Monèle Raphaël.C. B.ed, ', 57, lastPosition, null, null, 'center');
      lastPosition += 4;
      doc.text('Directrice du Préscolaire/Primaire', 57, lastPosition, null, null, 'center');
    } else if (['Secondaire', 'Nouveau Secondaire'].includes(categoriClasse)) {
      doc.text('Mme Mogeline Raphaël, MsEd , BA', 57, lastPosition, null, null, 'center');
      lastPosition += 4;
      doc.text('Directrice du Secondaire', 57, lastPosition, null, null, 'center');
    }
  }

  createOrUpdateFunc (t, model, queryArr = [], obj, fieldsToConcat = []) {
    if (!queryArr.length) { throw new Error('Empty query.[FOC-098]') }

    return this.txDataFetcher(t, model, queryArr, [], false, [])
      .then((resultModel) => {
        if (resultModel) {
          if (Array.isArray(fieldsToConcat)) {
            fieldsToConcat.forEach((item) => {
              if (resultModel.get(`${item}`) !== obj[`${item}`]) {
                obj[`${item}`] = `${resultModel.get(`${item}`)}${obj[`${item}`]}`
              }
            })
          }
          return this.knexUpdaterFunc(t, resultModel, obj, true);
        }

        return this.txItemSaver(t, model, obj, true);
      })
  }

  handleCsvFile (_filename, filePath, sheet_position) {
    try {
      if (!_filename) { throw new Error('Please use a valid file to complete this request. [CSV-01]'); }

      const splitFileName = _filename.split('.');
      if (!['xlsx', 'csv'].includes(splitFileName[splitFileName.length - 1])) { throw new Error('You can only use CSV or XLSX file type.') }

      const dataSheetList = this.xlxsToJsonConverter(filePath, false, sheet_position || 0);
      if (!dataSheetList.length) { throw new Error('Empty sheet, please use a valid reference') };
      return { error: null, data: dataSheetList }
    } catch (error) {
      return { error: error.message, data: [] }
    }
  }
}

module.exports = Controller;
