import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import Splash from '../components/splash'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Todoo</title>
        <meta name='description' content='Organise your work.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Splash />
      </main>
    </>
  )
}

export default Index

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
