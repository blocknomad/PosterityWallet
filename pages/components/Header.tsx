import Image from 'next/image'
import Link from 'next/link'
import { ConnectWallet } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";

export default function Header() {
  return (
    <header className="px-48 py-4 shadow border-gray-200 w-full flex items-center space-x-8">
      <Link href="/">
        <Image src="/logo.png" alt="Posterity logo" width="150" height="64" />
      </Link>
      <div className='grow' />
      {useAddress() ? (
        <div className='items-center space-x-5'>
          <Link href="/posterity-wallet">Posterity Wallet</Link>
          <Link href="/manage-heirs">Manage heirs</Link>
          <Link href="/recover-wallet">Recover wallet</Link>
        </div>
      ) : null}
      <ConnectWallet />
    </header>
  )
}
