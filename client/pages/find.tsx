import Link from "next/link";
import { useRouter } from "next/router"
import React from "react";
import Products from "../components/productList";
import Search from "../components/search";
import { getBrandName, getBrands } from "../lib/brandUtil";
import { getCategories, getCategoryName } from "../lib/categoryUtil";
import pool from "../lib/db";
import { getGenderIds, getGenderName, getGenders } from "../lib/genderUtil";
import { QueryBuilder } from "../lib/queryBuilder";
import styles from '../styles/Find.module.scss'

const removeFilter = (property: string, value: string) => {
    if(typeof window !== "undefined"){
        let url = new URL(window.location.href);
        url.searchParams.delete(property);

        return url.href;
    }
    return "/"
}
/*
OJO!!! Esta página es horrible para SEO, intentar no poner todo lo que se puede generar estático aquí :)
*/ 
export default function Find(props:any) {
    const router = useRouter();
    return (
        <>
            <div className={styles.searchFilter}>
                <div className={styles.searchBox}>
                    <Search options={props.filterOptions}filters={props.filters} filterBox></Search>
                </div>
            </div>

            {props.filters &&
            <ul className={styles.filters}>
                {props.filters.map((filter: any, index:number) => {
                return (
                    <li key={index} className={styles.filter} onClick={() => router.push(removeFilter(filter.property, filter.value))}>
                        <span className={styles.title}>{filter.name}</span>
                        <div className={styles.close} style={{backgroundImage: 'url(/close.svg)'}}></div>
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
        let options = query.c.split("-");
        options.map(async (option: any) => {
            dQ.appendEq("category_id", option);
            let name: any = await getCategoryName(option);
            if(name) {
                filter_names.push({name: name, property: "c", value: option});
            }
        });
    }
    if(query.b) {
        let options = query.b.split("-");
        options.map(async (option: any) => {
            dQ.appendEq("category_id", option);
            let name: any = await getBrandName(option);
            if(name) {
                filter_names.push({name: name, property: "b", value: option});
            }
        });
    }
    if(query.g) {
        let options = query.g.split("-");
        options.map(async (option: any) => {
            dQ.appendEq("category_id", option);
            let name: any = await getGenderName(option);
            if(name) {
                filter_names.push({name: name, property: "g", value: option});
            }
        });
    }
    const clothes: any[] = await dQ.query();
    const brands: any[] = await getBrands();
    const categories: any[] = await getCategories();
    const genders: any[] = await getGenders();
    return {props: {
        clothes: clothes, filters: filter_names, 
        filterOptions: [
            {name: "Marcas", values: brands}, 
            {name: "Categorías", values: categories},
            {name: "Géneros", values: genders}]
    }}
}
