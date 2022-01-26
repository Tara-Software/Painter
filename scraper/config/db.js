const { Pool } = require('pg');

const credentials = {
    user: "davi", 
    host: "localhost", 
    database: "davi", 
    password: "davie", 
    port: 5432
}
const pool = new Pool(credentials);

module.exports = pool;