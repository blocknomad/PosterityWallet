import Head from 'next/head'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import { useSDK } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";

import Button from './components/Button'
import PosterityWalletFactoryABI from "../abis/PosterityWalletFactory.json"
import Spinner from './components/Spinner';

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
  const [isLoadingPosterityWallet, setIsLoadingPosterityWallet] = useState(false)
  const [userPosterityWallet, setUserPosterityWallet] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isCreatingPosterityWallet, setIsCreatingPosterityWallet] = useState(false)
  const address = useAddress();
  const etherscanProvider = new ethers.providers.EtherscanProvider();
  const sdk = useSDK()
  const posterityWalletFactoryContract = sdk?.getContract("0x0E71E2ABA825B804e6BE4A993b06581d1D5B553D", PosterityWalletFactoryABI.abi)

  useEffect(() => {
    setIsLoadingPosterityWallet(true)

    if (address) {
      const getPosterityWallet = async () => {
        (await posterityWalletFactoryContract)?.call("getPosterityWallet", [address])
          .then(function (posterityWalletAddress: any) {
            setIsLoadingPosterityWallet(false)

            if (posterityWalletAddress === '0x0000000000000000000000000000000000000000') {
              setUserPosterityWallet(null)
            } else {
              setIsLoadingTransactions(true)

              etherscanProvider.getHistory(posterityWalletAddress).then((history: any) => {
                setTransactions(history.slice(0, 10))
                setIsLoadingTransactions(false)
              });
            }
          })
          .finally(function () {
            setIsLoadingPosterityWallet(false)
          })
      }

      getPosterityWallet()
    }
  }, [address])

  const getPosterityWalletContent = () => {
    if (isCreatingPosterityWallet) {
      return (
        
      )
    } else {
      return (
        <p className='text-base'>
          You still don't have a Posterity Wallet. Click on the "Create" button above to create one.
        </p>
      )
    }
  }

  const getTransactionsContent = () => {
    if (isLoadingTransactions) {
      return <Spinner />
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

  if (isLoadingPosterityWallet) {
    return <Spinner />
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
        {userPosterityWallet ? (
          <>
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
          </>
        ) : (
          <>
            <div className='flex items-center space-x-5'>
              <h1 className='text-3xl font-bold'>Posterity Wallet</h1>
              {isCreatingPosterityWallet ? null : <Button size='small' onClick={() => setIsCreatingPosterityWallet(true)}>Create</Button>}
            </div>
            <div className='my-5 flex items-center'>
              {getPosterityWalletContent()}
            </div>
          </>
        )}

      </main>
    </>
  )
}
