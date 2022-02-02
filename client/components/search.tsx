import styles from '../styles/Search.module.scss'

export default function Search(props: any) {
    // TODO: Añadir método de búsqueda
    let filters = props.filters;
    return (
        <>
        <div className={styles.wrapper}>
        <div className={styles.searchBox} >
            <div className={styles.logo}><img src="/lupa.svg" alt="Imagen de una lupa" /></div>
            <div className={styles.input}><span className={styles.label}>Encuentra tu nuevo outfit</span></div>
        </div>
        {props.filterBox && 
            <div className={styles.filterBox}>
                <img src="/filter.svg" alt="Filtrar" />
                <div className={styles.text}>Más filtros</div>
            </div>
        }
        </div>
        {props.filterBox && 
            <div className={styles.filterDialog}>
                A ver tu que te esperabas, memo
            </div>
        }
        </>
    )
}