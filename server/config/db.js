require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   ssl: { rejectUnauthorized: false }
});

const connectDB = async () => {
   try {
      await pool.connect();
      console.log("Connected to the database!");
   } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
   }
};

module.exports = { pool, connectDB };
