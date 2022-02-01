export default function Product(props: any) {
    console.log(props.item);
    return (
        <li className="product-item">
            <div className="product-img"><img src="https://picsum.photos/450/400" alt="" /></div>
            <span className="product-name">{props.item.name.charAt(0).toUpperCase() + props.item.name.slice(1)}</span>
            <span className="product-category">{props.item.category}</span>
            <span className="product-price">{props.item.price} €</span>
        </li>
    )
}