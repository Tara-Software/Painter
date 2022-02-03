import { filter } from 'domutils';
import { useRouter } from 'next/router';
import styles from '../styles/Search.module.scss'
var options: any[] = [];
const buildURL = () => {
    let url = new URL(window.location.href);
    
    options.map((item: any) => {
        if(url.searchParams.get(item.property)) {
            url.searchParams.set(item.property, 
                url.searchParams.get(item.property) + "-" + item.id);
        } else {
            url.searchParams.set(item.property, item.id);
        }
    })

    return url.href;
}
const closeDialog = () =>  {
    let dialog = document.getElementById(styles.filterDialog);

    if(dialog) {
        dialog.style.display = "none";
    }
}
const appendFilter = (e: any, property: string, id: any) => {
    let title = e.target.parentElement;
    let filterOption = {
        property: property,
        id: id
    }
    console.log(filterOption);
    if(title.classList.contains("active")) {
        title.classList.remove("active");
        options = options.filter((value: any) => {
            return !(value.id == filterOption.id && value.property == value.property)
        });
        console.log(options);
    } else {
        title.classList.add("active");
        if(!options.includes(filterOption)) {
            options.push(filterOption);
        }
    }
    
}
export default function Search(props: any) {
    // TODO: Añadir método de búsqueda
    let filters = props.filters;
    const router = useRouter();
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
            <div id={styles.filterDialog}>
                <div className={styles.close} onClick={closeDialog}><img  src="/close.svg" alt="" /></div>

                <h2>Filtrar los resultados</h2>
                {props.options.map((option: any, index: number) => (
                    <section key={index} className={styles.filterSection}>
                        <p>Filtro por {option.name}</p>
                        <ul>
                            {option.values.map((item: any, index: number) =>{
                                let id: string;
                                let property: string = option.name.charAt(0).toLowerCase();
                                if(property == "c") {
                                    id = "category_id";
                                } else if(property == "m"){
                                    property = "b"
                                    id = "brand_id";
                                } else {
                                    id = "gender_id";
                                }
                                return <li key={index} className={styles.filter}><span className={styles.title} onClick={(e) => appendFilter(e, property, item[id])}>{item.name}</span></li>
                            })}
                        </ul>
                    </section>
                ))}
                <div><button onClick={() => router.push(buildURL())}>Aplicar filtros</button></div>
            </div>
        }
        </>
    )
}