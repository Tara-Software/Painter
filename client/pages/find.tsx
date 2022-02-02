import { useRouter } from "next/router"
import Products from "../components/productList";
import Search from "../components/search";
import pool from "../lib/db";
import styles from '../styles/Find.module.scss'

const removeFilter = (e: any) => {
    console.log("xd")
}
/*
OJO!!! Esta página es horrible para SEO, intentar no poner todo lo que se puede generar estático aquí :)
*/ 
export default function Find(props:any) {
  
    return (
        <>
            <div className={styles.searchFilter}>
                <div className={styles.searchBox}>
                    <Search filters={props.filters} filterBox></Search>
                </div>
            </div>

            {props.filters &&
            <ul className={styles.filters}>
                {props.filters.map((filter: string, index:number) => {
                return (
                    <li key={index} className={styles.filter}>
                        <span className={styles.title}>{filter}</span>
                        <div className={styles.close} onClick={removeFilter} style={{backgroundImage: 'url(/close.svg)'}}></div>
                    </li>
                )
                })}
            </ul>
        }
            <Products clothes={props.clothes} />
        </>
    )
}

export async function getServerSideProps({ query }: any) {  
    // Esto tendrá que ir en un archivo a parte seguramente.
    // BEGIN QUERY BUILDER
    // Query for clothes
    let text: string = "SELECT * FROM clothes ";
    let values: Array<any> = []

    let filter_names: Array<string> = [];
    if(query.c) {
        text += `WHERE clothes.category_id = $1`;
        values.push(query.c);
        
        let title = `SELECT * FROM categories WHERE category_id = $1`
        const name = await pool.query(title, [query.c]);
        try {
            filter_names.push(name.rows[0].name);
        } catch (error) {
            
        }
    }
    const res = await pool.query(text, values);
    let clothes: Array<any> = [];
    try {
        clothes = res.rows.map((item) =>  {
            item.created_at = item.created_at.getTime();
            return item;
        })
    } catch (error) {
        
    }
    return {props: {clothes: clothes, filters: filter_names}}
}