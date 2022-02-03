import pool from "./db";

export class QueryBuilder {
    text: string;
    values: any[];
    table: string;
    
    constructor(table: string) {
        this.text = `SELECT * FROM ${table}`;
        this.values = [];
        this.table = table;
    }
    private append(property: string, value: any, op: string){
        if(this.values.length > 0) {
            this.text += " AND";
        } else {
            this.text += " WHERE"
        }
        this.text += ` ${this.table}.${property} ${op} $${this.values.length +1}`;
        this.values.push(value);
    }
    appendEq(property: string, value: any) {
        this.append(property, value, "=");
    }
    toString() {
        return `QUERY: ${this.text}\nVALUES: ${this.values}`;
    }
    getValues() {
        return this.values;
    }
    async query() {
        try {
            return (await pool.query(this.text, this.values)).rows;
        } catch(e) {
            return [];
        }
    }
}