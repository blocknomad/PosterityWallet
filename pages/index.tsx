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
      <main>
        <div className='px-48 py-12 flex items-center bg-[url("../public/hero.svg")] bg-no-repeat bg-right-bottom min-h-screen'>
          <h1 className='text-6xl font-bold w-1/2'>A thoughtful way to show love to those who matter to you.</h1>
        </div>
        <div className='px-48 py-20 my-20 flex items-center flex-col text-center bg-gray-100'>
          <div className='space-y-10 text-2xl w-3/4'>
            <p className=''>The Cryptoeconomy came to solve a wide range of problems, from asset ownership to transparency and privacy.</p>
            <p className=''>To date, we have achieved important milestones.</p>
            <p className=''>Currently, we can transfer value via tokens to anyone, anywhere.</p>
            <p className=''>If you lose your password and even the seed phrase, there are still chances to regain access to your funds.</p>
            <p className=''>Imagine you pass away, will your funds be available to those who are important to you? Posterity is here to help you deal with these problems.</p>
          </div>
        </div>
        <div className='px-48 py-20 my-20 flex items-center flex-col'>
          <div className='space-y-12 '>
            <Image src="/how-it-works-successor.png" width="890" height="143" alt="Successor" />
            <Image src="/how-it-works-heir.png" className='ml-6' width="734" height="149" alt="Heir" />
          </div>
        </div>
      </main>
    </>
  )
}
