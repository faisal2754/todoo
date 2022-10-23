import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../styles/globals.scss'

export const queryClient = new QueryClient()

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastContainer theme='dark' />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
