import styles from '../styles/RelevantCategories.module.scss'

export default function relevantCategories() {
    return (
        <div className={styles.wrapper}>
            <ul>
                <li className={styles.category}>Marcas</li>
                <li className={styles.category}>Zapatos</li>
                <li className={styles.category}>Chaquetas</li>
                <li className={styles.category}>Vestidos</li>
                <li className={styles.category}>Complementos</li>
                <li className={styles.category}>Camisetas</li>
            </ul>
        </div>
    )
}