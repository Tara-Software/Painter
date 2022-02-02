import Link from 'next/link'
import styles from '../styles/ProductList.module.scss'

export default function Products(props: any) {
    return (
    <div className={styles.wrapper}>
        <ul>
            {props.clothes?.map((item: any, index: number)=> {
            return (
            <li key={index} className={styles.item}>
                <Link href={`/clothes/${item.clothes_id}`}>
                    <a>
                        <div className={styles.img}><img src="https://picsum.photos/450/400" alt="" /></div>
                        <span className={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
                        <span className={styles.category}>{item.category}</span>
                        <span className={styles.price}>{item.price} €</span>
                    </a>
                </Link>
                
            </li>
            )
        })}
        </ul>
    </div>
    )
}