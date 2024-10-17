const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/user');
require('dotenv').config();

const signup = async (req, res) => {
   const { username, password } = req.body;
   const existingUser = await findUserByUsername(username);

   if (existingUser) {
      return res.status(400).json({ message: 'Username is taken.' });
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const user = await createUser(username, hashedPassword);
   res.status(201).json({ message: 'User created successfully!', user });
};


const login = async (req, res) => {
   const { username, password } = req.body;
   const user = await findUserByUsername(username);

   if (!user) {
      return res.status(404).json({ message: 'User not found' });
   }

   const isSame = await bcrypt.compare(password, user.password);
   if (!isSame) {
      return res.status(400).json({ message: 'Invalid credentials.' });
   }

   const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
   });

   res.cookie('token', token, { httpOnly: true});
   res.status(200).json({ message: 'Login successful!' });
};

const logout = (req, res) => {
   res.clearCookie('token');
   res.status(200).json({ message: 'Logout successful!' });
};

module.exports = { signup, login, logout };
