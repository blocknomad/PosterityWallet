import Head from 'next/head'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';

import Button from './components/Button'
import Input from './components/Input';
import SvgButton from './components/SvgButton';

interface Heir {
  userAddress: string;
  percentage: number;
}

const HeirTile = ({ heir }: { heir: Heir }) => {
  return (
    <div className='py-4 border-b border-gray-200 last:border-0 flex justify-between'>
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

const HeirsForm = ({ heirs, onCancel }: { heirs: Heir[], onCancel: () => void }) => {
  const { control, register } = useForm({
    defaultValues: {
      heirs: heirs.length > 0 ? heirs : [{ userAddress: '', percentage: 0 }]
    }
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "heirs", // unique name for your Field Array
  });

  return (
    <div className='w-[500px]'>
      <div>
        {fields.map((field, index) => (
          <div className='py-4 border-b border-gray-200 last:border-0 flex space-x-2 flex items-center' key={field.id}>
            <Input
              className="grow"
              placeholder="Heir wallet address"
              {...register(`heirs.${index}.userAddress`)}
            />
            <Input
              className="w-[70px]"
              maxLength="3"
              placeholder="Percentage"
              {...register(`heirs.${index}.percentage`)}
            />
            <SvgButton onClick={() => remove(index)}>
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
            </SvgButton>
          </div>
        ))}
      </div>
      <Button onClick={() => append({ userAddress: '', percentage: 0 })} className='w-full' variant='secondary' size='small'>
        Add heir
      </Button>
      <hr className="my-5 border-t border-gray-200" />
      <div className='space-y-2'>
        <Button onClick={() => append({ userAddress: '', percentage: 0 })} className='w-full' variant='primary'>
          Save heirs
        </Button>
        <Button onClick={onCancel} className='w-full' variant='secondary'>
          Cancel
        </Button>
      </div >

    </div >
  );
}

export default function Home() {
  const [heirs, setHeirs] = useState<Heir[]>([{
    userAddress: '0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE04',
    percentage: 30
  }, {
    userAddress: '0x27b3f8B6Efc8927CD55aeca47CbfE416802aBE03',
    percentage: 70
  }])
  const [isModifyingHeirs, setIsModifyingHeirs] = useState(false)

  const getContent = () => {
    if (heirs.length > 0) {
      if (isModifyingHeirs) {
        return <HeirsForm heirs={heirs} onCancel={() => setIsModifyingHeirs(false)} />
      } else {
        return (
          <div className='w-[500px]'>
            {heirs.sort((a, b) => b.percentage - a.percentage).map((heir) => <HeirTile key={heir.userAddress} heir={heir} />)}
          </div>
        )
      }

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
          {isModifyingHeirs ? null :
            <Button size='small' onClick={() => setIsModifyingHeirs(true)}>Update heirs</Button>}
        </div>
        <div className='my-5 flex items-center'>
          {getContent()}
        </div>
      </main>
    </>
  )
}
