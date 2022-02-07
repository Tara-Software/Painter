require('dotenv').config();
const { Pool } = require('pg');
const { Deta } = require("deta");

// DETA
const deta = new Deta(process.env.DETAPASSWORD).Drive("images");
// POSTGRESQL
const credentials = {
    user: "davi", 
    host: "localhost", 
    database: "davi", 
    password: process.env.PGPASSWORD, 
    port: 5432
}
const pool = new Pool(credentials);

module.exports = { pool, deta };