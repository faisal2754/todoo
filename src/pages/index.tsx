import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { getServerAuthSession } from '@/server/common/get-server-auth-session'
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res })

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
