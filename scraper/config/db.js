const { Pool, Client } = require('pg');

const credentials = {
    user: "daiant",
    host: "localhost",
    database: "restored",
    password: "daiant", 
    port: 5432
}
const pool = new Pool(credentials);

module.exports = pool;