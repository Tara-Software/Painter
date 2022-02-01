export default function BrandBanner(props: any) {
    return(
       <div className="banner-wrapper">
           <img src="https://picsum.photos/600/300" alt="" />
           <div className="banner-info">
              <h2 className="banner-title">{props.brand.name}</h2>
           </div>
       </div>
    )
}