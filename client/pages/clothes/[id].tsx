import { createCipheriv } from 'crypto';
import { useRouter } from 'next/router'
import { format } from 'path/posix';
import Carousel from '../../components/carousel';
import { getBrandName } from '../../lib/brandUtil';
import { getClothesIds, getSingleClothes } from '../../lib/clothesUtil';
import pool from '../../lib/db';
import { getImagesFromClothes } from '../../lib/imageUtil';
import { QueryBuilder } from '../../lib/queryBuilder';
import styles from '../../styles/Product.module.scss'

export default function Product(props: any) {
    let product = props.clothes;
    const router = useRouter();
    const format = (price: number) => {
        //  "EE:cc €"
        let res:string = price.toFixed(2).toString().replaceAll(".", ",");
        return res + " €";
    }
    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    const sizes = JSON.parse(product.size);
    console.log(sizes);
    return (
        <>
        <div className={styles.wrapper}>
            <Carousel images={props.images}></Carousel>
            <div className={styles.back} onClick={() => router.back()}><img src="/back.svg" alt="Atrás" /></div>
            <div className={styles.info}>
                <h2 className={styles.title}>{capitalize(product.name)}</h2>
                <p className={styles.brand}>{capitalize(props.brand)}</p>
                <div className={styles.sizes}>
                    {sizes.map((s: {size: string, disabled: boolean}, index: number) => {
                        return <span key={index} className={`${styles.size} ${s.disabled ? styles.disabled: ""}`}>{s.size}</span>
                    })}
                </div>
                <p className={styles.description}>{product.description}</p>
            </div>
            <div className={styles.overlay}>
                <div className={styles.prices}>
                    {product.original_price && <>
                    <div className={styles.original_price}>{product.original_price}</div>
                    </>}
                    <div className={styles.price}>{format(product.price)}</div>
                </div>
                <button>Añadir a la sesta</button>
            </div>
        </div>
        
        </>
    )
}

export async function getStaticPaths() {
    const res = await getClothesIds();
    const paths = res.map((item: any) => {
        return(
            {
                params : {
                    id: item.clothes_id.toString()
                }
            }
        )
    });
        
    return {
        paths, 
        fallback: false
    }
}

export async function getStaticProps({ params }: any) {
    const clothes = await getSingleClothes(params.id);
    const brand_name = await getBrandName(clothes.brand_id);
    const images = await getImagesFromClothes(clothes.clothes_id);
    return {
        props: {
            id: params.id,
            clothes,
            images,
            brand: brand_name
        }
    }
}