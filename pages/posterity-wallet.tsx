import Head from 'next/head'
import Button from './components/Button'

export default function Home() {
  return (
    <>
      <Head>
        <title>Posterity Wallet</title>
        <meta name="description" content="A thoughtful way to show love to those who matter to you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='px-48 py-12'>
        <div className='flex items-center space-x-5'>
          <h1 className='text-3xl font-bold'>Posterity Wallet</h1>
          <div className='bg-gray-100 truncate rounded-md py-1 px-3 max-w-[140px] text-sm'>0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE04</div>
        </div>
        <div className='my-5 flex items-center space-x-10'>
          <p className='text-5xl font-thin'>0.74 <span className='text-3xl'>MATIC</span></p>
          <Button size='small'>Send</Button>
        </div>
        <hr className="my-8 border-t border-gray-200" />
      </main>
    </>
  )
}
