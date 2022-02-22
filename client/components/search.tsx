import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Search.module.scss'

const closeDialog = () =>  {
    let dialog = document.getElementById(styles.filterDialog);

    if(dialog) {
        dialog.style.width = "0";
    }
}
const showDialog = () => {
    let dialog = document.getElementById(styles.filterDialog);
    if(dialog) {
        dialog.style.width = "100%"
    }
}

export default function Search(props: any) {
    // TODO: Añadir método de búsqueda
    
    const [url, setUrl] = useState(new URL(props.url));
    const [options, setOptions]: any = useState([]);
    const router = useRouter();    
    
    useEffect(() => {
        let newUrl = new URL(props.url);
        let res = [];
        for(let p of newUrl.searchParams.entries() as any) {
            res.push({
                property: p[0],
                id: p[1]
            });
        }
        setOptions([...new Set(res) as any]);
        setUrl(newUrl);
    }, [props.url]);


    const buildURL = () => {  
        url.searchParams.delete("b");
        url.searchParams.delete("c");
        url.searchParams.delete("g");  
        options.map((item: any) => {
            url.searchParams.append(item.property, item.id);
        });
        closeDialog();
        setUrl(url)
        props.callback(url);
        return url.href;
    }
    const appendFilter = (e: any, property: string, id: any) => {
        let title = e.target.parentElement;
        let filterOption = {
            property: property,
            id: id
        }
        let isOption: boolean = options.some((v:any) => v.property == filterOption.property && v.id == filterOption.id);

        if(isOption) {
            title.classList.remove("active");
            setOptions(options.filter((value: any) => {
                return !(value.id == filterOption.id && value.property == value.property)
            }));
        } else {
            title.classList.add("active");
            if(!options.some((v:any) => v.id == filterOption.id && v.property == filterOption.property)) {
                setOptions(options.concat(filterOption));
            }
        }
    }
    function toggleFullUl(e: any, index: number): void {
        var section : HTMLElement= e.target.parentElement.parentElement;
        var rotate: HTMLElement = section.getElementsByTagName("span")[1];
        var ul: HTMLElement= section.getElementsByTagName("ul")[0];
        if(rotate) {
            rotate.classList.toggle("up");
        }
        if(ul) {
            ul.classList.toggle("expand");
        }
    }

    return (
        <>
        <div className={styles.wrapper}>
        <label className={styles.searchBox} >
            <div className={styles.logo}><img src="/lupa.svg" alt="Imagen de una lupa" /></div>
            <input className={styles.input} placeholder='Encuentra tu nuevo outfit' />
        </label>
        {props.filterBox && 
            <div className={styles.filterBox} onClick={showDialog}>
                <img src="/filter.svg" alt="Filtrar" />
                <div className={styles.text}>Más filtros</div>
            </div>
        }
        </div>
        {props.filterBox && 
            <div id={styles.filterDialog}>
                <div className={styles.close} onClick={closeDialog}><img  src="/close.svg" alt="" /></div>

                <h2 className={styles.dialogTitle}>Filtrar los resultados</h2>
                {props.options.map((option: any, index: number) => (
                    <section key={index} className={styles.filterSection}>
                        <div className={styles.align} onClick={(e): any => toggleFullUl(e, index)}><span>Filtro por {option.name}</span><span><img src="/arrow.svg"></img></span></div>
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
                                let isActive = options.some((v:any)=> v.property == property && v.id == item[id]);
                                let className = isActive ? `${styles.filter} active` : styles.filter;
                                if(isActive && !options.some((v:any)=> v.property == property && v.id == item[id])) {
                                    setOptions(options.concat({
                                        property: property,
                                        id: item[id]
                                    }));
                                }
                                return <li key={index} className={className}><span className={styles.title} onClick={(e) => appendFilter(e, property, item[id])}>{item.name.split("-")[0]}</span></li>
                            })}
                        </ul>
                    </section>
                ))}
                <div className={styles.submit}><button onClick={() => router.push(buildURL())}>Aplicar filtros</button></div>
            </div>
        }
        </>
    )
}
