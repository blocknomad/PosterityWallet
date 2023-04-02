import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>Posterity Wallet</title>
        <meta name="description" content="A thoughtful way to show love to those who matter to you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='px-48 py-12 flex items-center bg-[url("../public/hero.svg")] bg-no-repeat bg-right-bottom min-h-screen'>
        <h1 className='text-6xl font-bold w-1/2'>A thoughtful way to show love to those who matter to you.</h1>
      </main>
    </>
  )
}
