//this is a Middleware to authenticate jwt, to be used in many diff routes

const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).send('Unauthorized'); //401 means unauthorized, server doesn't know who u

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token: " + token);
      return res.status(401).send('Invalid token'); //will not go next() 
    }
    req.user = user;
    next(); //forwarding to next middle-ware
  });
};

module.exports = authenticateToken;