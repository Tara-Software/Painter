require('dotenv').config();
const { Pool } = require('pg');

// POSTGRESQL
const credentials = {
    user: "davi", 
    host: "localhost", 
    database: "davi", 
    password: process.env.PGPASSWORD, 
    port: 5432
}
const pool = new Pool(credentials);

module.exports = { pool };