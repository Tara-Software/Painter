import styles from '../styles/Search.module.scss'

export default function Search() {
    // TODO: Añadir método de búsqueda
    return (
    <div className={styles.wrapper} >
        <div className={styles.logo}><img src="/lupa.svg" alt="Imagen de una lupa" /></div>
        <div className={styles.input}><span className={styles.label}>Encuentra tu nuevo outfit</span></div>
    </div>
    )
}