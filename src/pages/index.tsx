import type { NextPage } from 'next'
import Head from 'next/head'
import Splash from '../components/splash'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name='description' content='Your favourite Todo app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Splash />
      </main>
    </>
  )
}

export default Home
