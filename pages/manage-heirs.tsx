import Head from 'next/head'
import Button from './components/Button'
import { useState } from 'react'

interface Heir {
  userAddress: string;
  percentage: number;
}

const HeirTile = ({ heir }: { heir: Heir }) => {
  return (
    <div className='py-4 border-b border-gray-200 flex justify-between'>
      <p className=''>{heir.userAddress}</p>
      <div className='flex items-center space-x-2'>
        <p className=''>{heir.percentage}%</p>
        <div className='w-[40px] h-[8px] rounded-md bg-gray-100 overflow-hidden'>
          <div className='bg-primary' style={{ width: `${heir.percentage}%` }}>&nbsp;</div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [heirs, setHeirs] = useState<Heir[]>([{
    userAddress: '0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE04',
    percentage: 30
  }, {
    userAddress: '0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE04',
    percentage: 70
  }])

  const getContent = () => {
    if (heirs.length > 0) {
      return (
        <div className='w-[500px]'>
          {heirs.sort((a, b) => b.percentage - a.percentage).map((heir) => <HeirTile key={heir.userAddress} heir={heir} />)}
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <Head>
        <title>Manage heirs</title>
        <meta name="description" content="A thoughtful way to show love to those who matter to you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='px-48 py-12'>
        <div className='flex items-center space-x-5'>
          <h1 className='text-3xl font-bold'>Manage heirs</h1>
          <Button size='small'>Update heirs</Button>
        </div>
        <div className='my-5 flex items-center'>
          {getContent()}
        </div>
      </main>
    </>
  )
}
