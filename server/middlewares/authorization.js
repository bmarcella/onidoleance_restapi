const jwt = require('jsonwebtoken');

exports. verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const { ln = 'fr' } = req.query;
  if (!bearerHeader) {
    res.status(403).send({
      message: 'Unauthorized! Need Token to access',
      code: 4033
    });
    return;
  }

  if (!bearerHeader.includes('Bearer')) {
    res.status(403).send({
      message: 'Unauthorized! Token must be passed as Bearer token. Ex: Bearer TOKEN_HERE',
      code: 4032
    });
    return;
  }

  const token = bearerHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({
        message: 'Unauthorized! Invalid token, login to get your token',
        code: 4031
      });
    } else {
      req.auth = decoded;
      next();
    }
  });
};

exports.isAdminLogin = (req, res, next) => {
  let check = Number(req.auth.role_id || 'NA') ? true : false;
  if(!check){
    return res.status(403).json({
      message: 'Unauthorized! Please login as administrator',
      code: 4032
    });
  }else{
    next();
  }
};

exports.blockedEndpoint = (req, res, next) => {
  const { ln = 'fr' } = req.query;
  res.status(403).json({
    message: 'blocked endpoint',
    code: 4032
  });
};
