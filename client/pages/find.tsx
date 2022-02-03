import { useRouter } from "next/router"
import Products from "../components/productList";
import Search from "../components/search";
import { getBrandName } from "../lib/brandUtil";
import { getCategoryName } from "../lib/categoryUtil";
import pool from "../lib/db";
import { getGenderName } from "../lib/genderUtil";
import { QueryBuilder } from "../lib/queryBuilder";
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
                {props.filters.map((filter: any, index:number) => {
                return (
                    <li key={index} className={styles.filter}>
                        <span className={styles.title}>{filter.name}</span>
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
    const filter_names: any[] = [];
    let dQ = new QueryBuilder("clothes");
    
    if(query.c) {
        dQ.appendEq("category_id", query.c);
        let name: any = await getCategoryName(query.c);
        if(name) {
            filter_names.push(name);
        }
    }
    if(query.b) {
        dQ.appendEq("brand_id", query.b);
        let name: any = await getBrandName(query.b);
        if(name) {
            filter_names.push(name);
        }
    }
    if(query.g) {
        dQ.appendEq("gender_id", query.g);
        let name: any = await getGenderName(query.g);
        if(name) {
            filter_names.push(name);
        }
    }
    const clothes: any[] = await dQ.query();
    return {props: {
        clothes: clothes, filters: filter_names
    }}
}
