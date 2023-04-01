import Head from 'next/head'
import Button from './components/Button'
import { useState } from 'react';

interface Successor {
  userAddress: string;
  taxId: string;
  recovered: boolean;
}

const SuccessorTile = ({ successor }: { successor: Successor }) => {
  return (
    <div className='py-4 border-b border-gray-200 last:border-0 flex items-center justify-between'>
      <div className='space-y-1'>
        <p className=''>{successor.userAddress}</p>
        <p className='text-sm text-gray-500'>{successor.taxId}</p>
      </div>
      {successor.recovered ? (
        <Button size="small" success={successor.recovered}>Recovered</Button>
      ) : (
        <Button size="small">Recover</Button>
      )}
    </div>
  )
}

export default function RecoverWallet() {
  const [successors, setSuccessors] = useState<Successor[]>([{
    userAddress: '0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE04',
    taxId: '345.089.353-03',
    recovered: true,
  }, {
    userAddress: '0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE03',
    taxId: '983.875.398-34',
    recovered: false,
  }])

  const getContent = () => {
    if (successors.length > 0) {
      return (
        <div className='w-[500px]'>
          {successors.map((successor) => <SuccessorTile key={successor.userAddress} successor={successor} />)}
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <Head>
        <title>Recover wallet</title>
        <meta name="description" content="A thoughtful way to show love to those who matter to you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='px-48 py-12'>
        <div className='flex items-center space-x-5'>
          <h1 className='text-3xl font-bold'>Recover wallet</h1>
        </div>
        <div className='my-5 flex items-center'>
          {getContent()}
        </div>
      </main>
    </>
  )
}
