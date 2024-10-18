const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
   const token = req.cookies.token;
   if (!token) {
      return res.status(401).json({ message: 'Access denied as no token was provided.' });
   }
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
   }
};

module.exports = { verifyToken };
