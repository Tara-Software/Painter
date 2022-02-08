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
            this.text += op;
        } else {
            this.text += " WHERE ("
        }
        this.text += `${this.table}.${property} = $${this.values.length +1}`;
        this.values.push(value);
    }
    private closeParenthesis() {
        this.text += `)`;
    }
    appendOr(property: string, value: any) {
        this.append(property, value, " OR ")
    }
    appendAnd(property: string, value: any) {
        this.append(property, value, ") AND (");
    }
    toString() {
        return `QUERY: ${this.text}\nVALUES: ${this.values}`;
    }
    getValues() {
        return this.values;
    }
    limit(limit : number) {
        if(this.values.length > 0) {
            this.closeParenthesis();
        }
        this.text += ` LIMIT $${this.values.length + 1}`;
        this.values.push(limit)
    }
    async query() {
        
        try {
         
            return (await pool.query(this.text, this.values)).rows;
        } catch(e) {
            return [];
        }
    }
    query2() {
        return new Promise(resolve => {
            resolve(pool.query(this.text, this.values));
        });
    }
}