import Head from 'next/head'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import { useSDK, useAddress } from "@thirdweb-dev/react";
import { useForm } from 'react-hook-form';

import Button from './components/Button'
import PosterityWalletFactoryABI from "../abis/PosterityWalletFactory.json"
import Spinner from './components/Spinner';
import Input from './components/Input';
import { CONSTANTS } from './utils/constants';

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
      <p className='truncate w-1/3 pr-7'>{ethers.utils.formatEther(transaction.value)} ETH</p>
    </div>
  )
}


const PosterityWalletForm = ({ onCancel, handlePosterityWalletCreation }: { onCancel: () => void; handlePosterityWalletCreation: any }) => {
  const [isCreatingPosterityWallet, setIsCreatingPosterityWallet] = useState(false)
  const { handleSubmit, register } = useForm({
    defaultValues: {
      taxId: ''
    }
  });

  const onSubmit = async ({ taxId }: { taxId: string }) => {
    setIsCreatingPosterityWallet(true)

    try {
      await handlePosterityWalletCreation(taxId)
    } catch (error) {
      alert(error)
      setIsCreatingPosterityWallet(false)
    }
  }

  const onError = (errors: any) => {
    alert(errors)
  }

  return (
    <div className='w-[500px]'>
      <form onSubmit={handleSubmit(onSubmit, onError)} className='border-b border-gray-200 last:border-0'>
        <Input
          className="w-full"
          placeholder="Your tax ID"
          {...register('taxId')}
        />
        <hr className="my-5 border-t border-gray-200" />
        <div className='space-y-2'>
          {isCreatingPosterityWallet ? (
            <Button className='w-full' variant='primary' disabled>
              Creating...
            </Button>
          ) : (
            <Button className='w-full' variant='primary'>
              Create
            </Button>
          )}
          <Button onClick={onCancel} className='w-full' variant='secondary' disabled={isCreatingPosterityWallet}>
            Cancel
          </Button>
        </div >
      </form >
    </div >
  );
}

export default function PosterityWallet() {
  const [isLoadingPosterityWallet, setIsLoadingPosterityWallet] = useState(false)
  const [userPosterityWallet, setUserPosterityWallet] = useState<string | null>(null)
  const [userPosterityWalletBalance, setUserPosterityWalletBalance] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isCreatingPosterityWallet, setIsCreatingPosterityWallet] = useState(false)
  const address = useAddress();
  const etherscanProvider = new ethers.providers.EtherscanProvider();
  const sdk = useSDK()
  const posterityWalletFactoryContract = sdk?.getContract(CONSTANTS.POSTERITY_WALLET_FACTORY_CONTRACT, PosterityWalletFactoryABI.abi)

  const getPosterityWalletTransaction = async (posterityWalletAddress: string) => {
    setIsLoadingTransactions(true)

    etherscanProvider.getHistory(posterityWalletAddress).then((history: any) => {
      setTransactions(history.slice(0, 10))
      setIsLoadingTransactions(false)
    });
  }
  const getPosterityWallet = async () => {
    (await posterityWalletFactoryContract)?.call("getPosterityWallet", [address])
      .then(function (posterityWalletAddress: any) {
        if (posterityWalletAddress === '0x0000000000000000000000000000000000000000') {
          setUserPosterityWallet(null)
          setIsLoadingPosterityWallet(false)
        } else {
          setUserPosterityWallet(posterityWalletAddress)
          getPosterityWalletTransaction(posterityWalletAddress)
          sdk?.getProvider().getBalance(posterityWalletAddress).then(balance => {
            setUserPosterityWalletBalance(balance)
          }).finally(() => {
            setIsLoadingPosterityWallet(false)
          })
        }
      })
      .finally(function () {
        setIsLoadingPosterityWallet(false)
      })
  }

  useEffect(() => {
    setIsLoadingPosterityWallet(true)

    if (address) {
      getPosterityWallet()
    }
  }, [address])

  const handlePosterityWalletCreation = async (taxId: string) => {
    try {
      const response = await (await posterityWalletFactoryContract)?.call("deploy", [Number(taxId)])
      const newPosterityWalletAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(response.receipt.logs[0].topics[2]))
      setIsCreatingPosterityWallet(false)
      setIsLoadingPosterityWallet(true)
      setUserPosterityWallet(newPosterityWalletAddress)
      sdk?.getProvider().getBalance(newPosterityWalletAddress).then(balance => {
        setUserPosterityWalletBalance(balance)
      }).finally(() => {
        setIsLoadingPosterityWallet(false)
      })
    } catch (e) {
      alert(e)
    }
  }

  const getPosterityWalletContent = () => {
    if (isCreatingPosterityWallet) {
      return (
        <PosterityWalletForm onCancel={() => setIsCreatingPosterityWallet(false)} handlePosterityWalletCreation={handlePosterityWalletCreation} />
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
      return (
        <p className='text-base'>
          There aren't recent transactions to show.
        </p>
      )
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
              <div className='bg-gray-100 truncate rounded-md py-1 px-3 max-w-[140px] text-sm'>{userPosterityWallet}</div>
            </div>
            <div className='my-5 flex items-center'>
              <p className='text-5xl font-thin'>{userPosterityWalletBalance ? ethers.utils.formatEther(userPosterityWalletBalance) : '0.0'} <span className='text-3xl'>ETH</span></p>
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
