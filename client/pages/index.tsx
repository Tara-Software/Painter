import type { NextPage } from 'next'
import Head from 'next/head'
import Search from '../components/search'
import RelevantCategories from '../components/relevantCategories'
import pool from '../lib/db'
import BrandBanner from '../components/brandbanner'
import Products from '../components/productList'
import { getBrands } from '../lib/brandUtil'
import { getClothes } from '../lib/clothesUtil'
import { getCategories } from '../lib/categoryUtil'
import { QueryBuilder } from '../lib/queryBuilder'

const Home: NextPage = ({ brands, clothes, categories }: any) => {
  return (
    <>
    <Search />
    <RelevantCategories categories={categories}/>
    <BrandBanner brand={brands[0]} />
    <Products clothes = {clothes} />
    
    </>
  )
}

export default Home

// Esta función se llama en build time en el lado del servidor. 
// No se llama desde el cliente, por lo que se puede obtener datos dee la base de 
// datos incluso
// La movida que me preocupa es que se pueden hacer llamadas a la DB desde aquí
// Y es mejor eso que llamadas a fuera.
export async function getStaticProps() {
  
  // Quizá añadir un orden del ultimo que se ha modificado
  const brands: any[] = await getBrands(2);
  const clothes: any[] = await getClothes(4);
  const categories: any[] = await getCategories(6);

  return {
    props: {
      brands,
      clothes,
      categories
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 86400 seconds
    revalidate: 86400, // A day in seconds
  }
}
