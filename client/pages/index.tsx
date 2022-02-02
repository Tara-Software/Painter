import type { NextPage } from 'next'
import Head from 'next/head'
import Search from '../components/search'
import RelevantCategories from '../components/relevantCategories'
import pool from '../lib/db'
import BrandBanner from '../components/brandbanner'
import Products from '../components/productList'

const Home: NextPage = ({ brands, clothes }: any) => {
  return (
    <>
    <Search />
    <RelevantCategories />
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
  let text = `SELECT * FROM brands LIMIT 2`
  let res = await pool.query(text, []);

  let brands: any = [];
  try { brands = res.rows; } catch(e) { /* Algo fue mal pues */ }
  text = `SELECT * FROM clothes LIMIT 4`
  res = await pool.query(text, []);
  let clothes: any = [];
  try { clothes = res.rows.map((row) => {
    row.created_at = row.created_at.getTime();
    return row;
  }); } catch(e) { /* Algo fue mal pues */ }
  return {
    props: {
      brands,
      clothes
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 86400 seconds
    revalidate: 86400, // In seconds
  }
}
