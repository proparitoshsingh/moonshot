const {pool} = require('../config/db');

const createUser = async (username, hashedPassword, email) => {
   const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email]
   );
   return result.rows[0];
};

const findUserByUsername = async (username) => {
   const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
   );
   return result.rows[0];
};

const findUserByEmail= async (email) => {
   const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
   );
   return result.rows[0];
};

module.exports = { createUser, findUserByUsername, findUserByEmail };
