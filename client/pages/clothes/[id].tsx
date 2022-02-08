import { createCipheriv } from 'crypto';
import { useRouter } from 'next/router'
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
    return (
        <>
        <div className={styles.wrapper}>
            <Carousel images={props.images}></Carousel>
            <div className={styles.back} onClick={() => router.back()}><img src="/back.svg" alt="Atrás" /></div>
            <div className={styles.info}>
                <h2 className={styles.title}>{product.name}</h2>
                <p className={styles.brand}>{props.brand}</p>
            </div>
            <div className={styles.overlay}>
                <div className={styles.price}>{product.price} €</div>
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