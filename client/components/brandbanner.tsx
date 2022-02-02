import styles from '../styles/BrandBanner.module.scss'

export default function BrandBanner(props: any) {
    return(
       <div className={styles.wrapper}>
           <img src="https://picsum.photos/600/300" alt="" />
           <div className={styles.info}>
              <h2 className={styles.title}>{props.brand.name}</h2>
           </div>
       </div>
    )
}