import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Search from '../components/search'
import styles from '../styles/Home.module.css'
import RelevantCategories from '../components/relevantCategories'

const Home: NextPage = () => {
  return (
    <>
    <Search />
    <RelevantCategories />
    </>
  )
}

export default Home
