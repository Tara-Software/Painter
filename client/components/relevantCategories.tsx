import Link from 'next/link';
import styles from '../styles/RelevantCategories.module.scss'
const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export default function relevantCategories({ categories }: any) {
    return (
        <div className={styles.wrapper}>
            <ul>
                {categories.map((category: any, index: number) => {
                    return (
                    <li key={index} className={styles.category}>
                        <Link href={{pathname: '/find', query: { "c": category.category_id}}}>
                            <a>{capitalize(category.name).split("-")[0]}</a>
                        </Link>
                    </li>
                    )
                })}
            </ul>
        </div>
    )
}