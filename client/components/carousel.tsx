import styles from '../styles/Carousel.module.scss'
export default function Carousel({ images }: any) {
    return (
    <>
        <ul className={styles.wrapper}>
            {images.map((img: {image_id: number, clothes_id: number, url: string, title: string}, index: number) => {
                return (
                    <li key={index}>
                        <img src={img.url} alt="" />
                    </li>
                )
            })}
        </ul>
    </>
    )
}