import { useRouter } from "next/router"
import React, { useEffect, useState } from "react";
import Products from "../components/productList";
import Search from "../components/search";
import { getBrandName, getBrands } from "../lib/brandUtil";
import { getCategories, getCategoryName } from "../lib/categoryUtil";
import { getGenderName, getGenders } from "../lib/genderUtil";
import { getImagesFromClothes } from "../lib/imageUtil";
import { QueryBuilder } from "../lib/queryBuilder";
import styles from '../styles/Find.module.scss'

/*
OJO!!! Esta página es horrible para SEO, intentar no poner todo lo que se puede generar estático aquí :)
*/ 
export default function Find(props:any) {
    const router = useRouter();
    const [url, setUrl] = useState(props.url);

    const removeFilter = (property: string, value: string) => {
        if(typeof window !== "undefined"){
            let link = new URL(url);
            let values = new Set(link.searchParams.getAll(property));
            
            link.searchParams.delete(property);
            for(let v of values as any) {
                if(v != value) {
                    link.searchParams.append(property, v);
                }
            } 
            setUrl(link.href);
            router.push(link.href);
        }
        return "/"
    }
    const parentCallback = (data:string) => {
        setUrl(data);
    }
    return (
        <>
            <div className={styles.searchFilter}>
                <div className={styles.searchBox}>
                    <Search url={url} options={props.filterOptions} filters={props.filters} filterBox callback={parentCallback}></Search>
                </div>
            </div>

            {props.filters &&
            <ul className={styles.filters}>
                {props.filters.map((filter: any, index:number) => {
                return (
                    <li key={index} className={styles.filter} onClick={() => {removeFilter(filter.property, filter.value)}}>
                        <span className={styles.title}>{filter.name.split("-")[0]}</span>
                        <div className={styles.close} style={{backgroundImage: 'url(/close.svg)'}}></div>
                    </li>
                )
                })}
            </ul>
        }
            <Products clothes={props.clothes} images={props.images} />
        </>
    )
}

export async function getServerSideProps({ query, resolvedUrl, req }: any) {  
    // BEGIN QUERY BUILDER
    // Query for clothes;
    const filter_names: any[] = [];
    let dQ = new QueryBuilder("clothes");
    
    if(query.c) {
        let options = new Set<string>([query.c].flat());
        var index = 0;
        for(let option of options as any) {
            let name: any = await getCategoryName(option);
            let item = {name: name, property: "c", value: option};
            
            if(name) {
                if(index > 0) {
                    dQ.appendOr("category_id", option);
                }
                else {
                    dQ.appendAnd("category_id", option);
                }
                filter_names.push(item);
                index++;
            }
        }        
    }
    if(query.b) {
        
        let options = new Set<string>([query.b].flat());
        let index = 0;
        for(let option of options as any) {
            let name: any = await getBrandName(option);
            let item = {name: name, property: "b", value: option};
            
            if(name) {
                if(index > 0) {
                    dQ.appendOr("brand_id", option);
                }
                else {
                    dQ.appendAnd("brand_id", option);
                }
                filter_names.push(item);
                index++;
            }
        }
    }
    if(query.g) {
        let options = new Set<string>([query.g].flat());
        let index = 0;
        for(let option of options as any) {
            let name: any = await getGenderName(option);
            let item = {name: name, property: "g", value: option};

            if(name) {
                if(index > 0) {
                    dQ.appendOr("gender_id", option);
                }
                else {
                    dQ.appendAnd("gender_id", option);
                }
                filter_names.push(item);
                index++;
            }
        }
    }
    dQ.limit(20);
    let clothes = await dQ.query();
    // Query for img
    let images: any = {};
    for (let c of clothes) {
        images[c.clothes_id] = (await getImagesFromClothes(c.clothes_id))
    }
    
    const brands: any[] = await getBrands();
    const categories: any[] = await getCategories();
    const genders: any[] = await getGenders();
    
    return {props: {
        clothes: clothes, 
        images,
        filters: filter_names, 
        url: `http://${req.headers.host}${resolvedUrl}`,
        filterOptions: [
            {name: "Marcas", values: brands}, 
            {name: "Categorías", values: categories},
            {name: "Géneros", values: genders}],
    }}
}
