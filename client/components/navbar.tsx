import React, { MouseEventHandler, ReactElement } from "react"

const openNav = () => {
    let overlay = document.getElementById("menu-overlay");
    if(overlay) {
        overlay.style.width = "70%"
        overlay.style.borderRight = "1px solid #f3f3f3";
        overlay.style.boxShadow = "1px 0px 4px 0px rgb(39, 39, 39)";
        
    }
}
const closeNav = () => {
    let overlay = document.getElementById("menu-overlay");
    if(overlay) {
        overlay.style.width = "0"
        overlay.style.border = "none";
        overlay.style.boxShadow = "none";
    }
}

export default function Navbar() {
    return (
        <>
        <nav id="nav-envelope">
            <div className="burger" onClick={openNav}><img src="/burger.svg" alt="Menú"/></div>
            <div className="icons-wrapper">
                <ul>
                    <li className="icon"><img src="/heart.svg" alt="Tus favoritos" /></li>
                    <li className="icon"><img src="/shopping_cart.svg" alt="Carrito de la compra" /></li>
                    <li className="icon"><img src="/user.svg" alt="Tu perfil" /></li>
                </ul>
            </div>
        </nav>
        <div id="menu-overlay">
            <div className="logo"><img src="/logo.svg" alt="Logo" className="logo-img" /></div>
            <div className="close" onClick={closeNav}><img src="/close.svg" alt="" /></div>
            <div className="product-list">
                <ul>
                    <li className="product-item">Hombre</li>
                    <li className="product-item">Mujer</li>
                    <li className="product-item">Complementos</li>
                    <li className="product-item">Marcas</li>
                    <li className="product-item">Toda la ropa</li>
                </ul>
            </div>
            <div className="settings-list">
                <ul>
                    <li className="setting-item">Configuración de la aplicación</li>
                    <li className="setting-item">Tu cuenta</li>
                    <li className="setting-item">Cerrar sesión</li>
                </ul>
            </div>
        </div>
        </>
    )
}