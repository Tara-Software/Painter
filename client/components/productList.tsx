import Product from "./product"

export default function Products(props: any) {
    return (
    <div className="products-wrapper">
        <ul>
            {props.clothes?.map((item: any, index: number)=> {
            return <Product key={index} item={item} />
        })}
        </ul>
    </div>
    )
}