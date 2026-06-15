const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error: 'No token'});
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    next();
  } catch(e){
    res.status(401).json({error: 'Invalid token'});
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if(!roles.includes(req.user.role)) return res.status(403).json({error: 'Forbidden'});
  next();
};
