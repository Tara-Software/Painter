import { Pool } from 'pg';

const credentials = {
    user: "davi", 
    host: "localhost", 
    database: "davi", 
    password: process.env.PGPASSWORD, 
    port: 5432
}
const pool = new Pool(credentials);

export default pool