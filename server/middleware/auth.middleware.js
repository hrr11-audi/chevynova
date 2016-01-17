var jwt = require('jsonwebtoken');
var tokenSecret;

if (process.env.NODE_ENV === undefined) {
  tokenSecret = require('../config/secrets').authentication.tokenSecret;
} else {
  tokenSecret = process.env.TOKEN_SECRET;
}

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];
   if (!token) {
     return res.status(401).json({ success: false, reason: 'Invalid token' });
   }

  jwt.verify(token, tokenSecret, function(err, decoded) {
    if (err) {
      console.log(err);
      return res.status(401).json({ success: false, reason: 'Invalid token' });
    }
    req.decoded = decoded;
    next();
  });
};
