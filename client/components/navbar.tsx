import Link from "next/link";
import React, { MouseEventHandler, ReactElement } from "react"
import styles from '../styles/Navbar.module.scss'

const openNav = () => {
    let overlay = document.getElementById(styles.overlay);
    if(overlay) {
        overlay.style.width = "100%"
        overlay.style.borderRight = "1px solid #f3f3f3";
        overlay.style.boxShadow = "1px 0px 4px 0px rgb(39, 39, 39)";
        
    }
}
const closeNav = () => {
    let overlay = document.getElementById(styles.overlay);
    if(overlay) {
        overlay.style.width = "0"
        overlay.style.border = "none";
        overlay.style.boxShadow = "none";
    }
}

export default function Navbar() {
    return (
        <>
        <nav id={styles.navEnvelope}>
            <div className={styles.burger} onClick={openNav}><img src="/burger.svg" alt="Menú"/></div>
            <div className={styles.logo}><Link href="/"><a><img src="/logo.svg" alt="Logo" className={styles.logoImg} /></a></Link></div>
            <div className={styles.wrapper}>
                <ul>
                    <li className={styles.icon}><img src="/heart.svg" alt="Tus favoritos" /></li>
                    <li className={styles.icon}><img src="/shopping_cart.svg" alt="Carrito de la compra" /></li>
                    <li className={styles.icon}><img src="/user.svg" alt="Tu perfil" /></li>
                </ul>
            </div>
        </nav>
        <div id={styles.overlay}>
            <div className={styles.close} onClick={closeNav}><img src="/close.svg" alt="" /></div>
            <div className={styles.logo} onClick={closeNav}><Link href="/"><a><img src="/logo.svg" alt="Logo" className={styles.logoImg} /></a></Link></div>
            <div className={styles.list}>
                <ul>
                    <li className={styles.item} onClick={closeNav}><Link href={{pathname: "/find", query: {"g": "1"}}}>Hombre</Link></li>
                    <li className={styles.item} onClick={closeNav}><Link href={{pathname: "/find", query: {"g": "2"}}}>Mujer</Link></li>
                    <li className={styles.item} onClick={closeNav}><Link href={{pathname: "/find", query: {"g": "1"}}}>Complementos</Link></li>
                    <li className={styles.item} onClick={closeNav}><Link href={{pathname: "/find", query: {"g": "1"}}}>Marcas</Link></li>
                    <li className={styles.item} onClick={closeNav}><Link href={{pathname: "/find", }}>Toda la ropa</Link></li>
                </ul>
            </div>
            <div className={styles.settings}>
                <ul>
                    <li className={styles.item}>Configuración de la aplicación</li>
                    <li className={styles.item}>Tu cuenta</li>
                    <li className={styles.item}>Cerrar sesión</li>
                </ul>
            </div>
        </div>
        </>
    )
}