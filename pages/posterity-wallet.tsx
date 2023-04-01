import Head from 'next/head'
import Button from './components/Button'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';

interface Transaction {
  to: string;
  from: string;
  value: any;
  hash: string;
}

const TransactionTile = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className='py-4 border-b border-gray-200 last:border-0 flex justify-between'>
      <p className='truncate w-1/3 pr-7'>{transaction.from}</p>
      <p className='truncate w-1/3 pr-7'>{transaction.to}</p>
      <p className='truncate w-1/3 pr-7'>{ethers.utils.formatUnits(transaction.value, 18)} ETH</p>
    </div>
  )
}

export default function PosterityWallet() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const address = "0xd01159A043d1d6bc575daE358C6046F5Cc08e7E6";
  const etherscanProvider = new ethers.providers.EtherscanProvider();

  useEffect(() => {
    setIsLoadingTransactions(true)

    etherscanProvider.getHistory(address).then((history: any) => {
      setTransactions(history.slice(0, 10))
      setIsLoadingTransactions(false)
    });
  }, [])

  const getTransactionsContent = () => {
    if (isLoadingTransactions) {
      return null
    } else if (transactions.length > 0) {
      return (
        <>
          <div className='py-2 flex'>
            <p className='font-bold text-small w-1/3'>From</p>
            <p className='font-bold text-small w-1/3'>To</p>
            <p className='font-bold text-small w-1/3'>Value</p>
          </div>
          {transactions.map((transaction) => <TransactionTile transaction={transaction} key={transaction.hash} />)}
        </>
      )
    } else {
      return null
    }
  }

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
        <div className='my-5 flex items-center'>
          <p className='text-5xl font-thin'>0.74 <span className='text-3xl'>MATIC</span></p>
          <Button size='small' className='ml-10'>Deposit</Button>
          <Button size='small' className='ml-2'>Send</Button>
        </div>
        <hr className="my-8 border-t border-gray-200" />
        <div className='w-[700px]'>
          <h2 className='font-thin text-2xl mb-4'>Recent transactions</h2>
          {getTransactionsContent()}
        </div>
      </main>
    </>
  )
}
