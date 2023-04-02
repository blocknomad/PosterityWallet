import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThirdwebProvider } from "@thirdweb-dev/react";

import Header from './components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain="goerli" theme="light">
      <Header />
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}
