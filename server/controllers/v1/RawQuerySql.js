const RequestInfo = require("../../models/RequestInfo");
const Controller = require("../Controller");

class RawQuerySqlController extends Controller {
  constructor() {
    super();
    this.Model = RequestInfo;
  }
  paginateResults(results, page = 1, limit = 10){
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const paginatedResults = results.slice(startIndex, endIndex);
  
    const pageSize = Math.ceil(results.length / limit);
  
    return {
      results:paginatedResults,
      pagination:{
        page,
        pageSize
      }
    };
  }

  handleRawQuery(req, res, next){
    const {id, role_id} = req.auth;
    let { queryRaw = '', queryBind = []} = req.body;
    let {page,pageSize}=req.query;

    const arrayRestricted = ['UPDATE ','DELETE ','INSERT ','TRIGGER ', 'EXECUTE ', 'ALTER ', 'DROP ', 'GRANT ', 'REVOKE ', 'LOCK ', 'DESCRIBE ', 'SHOW ', 'USE ', 'INDEX ', 'CREATE ', 'EXEC '];
    queryRaw = `${queryRaw}`.toUpperCase();
    try {
      if(![1,2].includes(role_id)){ throw new Error('UNAUTHORIZED REQUEST, PLEASE CONTACT SYSTEM-ADMIN!.'); }
      if(!queryRaw.trim().length){ throw new Error('INVALID QUERY!.'); }
      if(!Array.isArray(queryBind)){ throw new Error('INVALID BOND ARRAY!.'); }
      if(queryRaw.includes('where') && !queryBind.length){ throw new Error('ANY QUERY WITH WHERE CLAUSE NEED TO USE BIND VALUE!.')}
      arrayRestricted.forEach((item)=>{
        if(queryRaw.includes(item)){ throw new Error('WE HAVE RESTRICTED SOME KEY ON QUERY, PLEASE USE A VALID VALUE!.'); }
      })

      this.sqlQuery(queryRaw.toLowerCase(), queryBind, null)
      .then((result)=>{
        const paginatedResult = this.paginateResults(result[0], page, pageSize);
        this.functionSuccess(paginatedResult.results, res, paginatedResult.pagination);
      }).catch((error)=>{
        this.functionError(error, res);
      })
    } catch (error) {
      this.functionError(error, res);
    }
  }
}

module.exports = RawQuerySqlController;
