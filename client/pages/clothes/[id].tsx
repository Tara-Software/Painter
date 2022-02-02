import { createCipheriv } from 'crypto';
import { useRouter } from 'next/router'
import pool from '../../lib/db';
import styles from '../../styles/Product.module.scss'

export default function Product(props: any) {
    let product = props.clothes;
    const router = useRouter();
    return (
        <>
        <div className={styles.wrapper}>
            <img src="https://picsum.photos/600/700" alt="Fotitio" />
            <div className={styles.back} onClick={() => router.back()}><img src="/back.svg" alt="Atrás" /></div>
            <div className={styles.info}>
                <h2 className={styles.title}>{product.name}</h2>
                <p className={styles.brand}>{props.brand}</p>
            </div>
        </div>
        <div className={styles.overlay}>
            <div className={styles.price}>{product.price} €</div>
            <button>Añadir a la sesta</button>
        </div>
        </>
    )
}

export async function getStaticPaths() {
    const text = `SELECT clothes_id FROM clothes`;
    const values: any[] = [];

    const res = await pool.query(text, values);
    
    let paths: any[] = [];
    if(res.rowCount > 0) {
        res.rows.map((item) => {
            paths.push({
                params : {
                    id: item.clothes_id.toString()
                }
            })
        })
    }

    return {
        paths, 
        fallback: false
    }
}

export async function getStaticProps({ params }: any) {
    let text = `SELECT * FROM clothes WHERE clothes_id = $1`;
    let values = [params.id];

    let res = await pool.query(text, values);
    let clothes = res.rows.map((item) => {
        item.created_at = item.created_at.getTime()
        return item;
    })[0];

    text = `SELECT name FROM brands WHERE brand_id = $1`;
    values = [clothes.brand_id];

    res = await pool.query(text, values);
    const brand_name = res.rows[0].name
    return {
        props: {
            id: params.id,
            clothes,
            brand: brand_name
        }
    }
}