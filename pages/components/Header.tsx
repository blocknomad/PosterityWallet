import Image from 'next/image'
import Link from 'next/link'
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Header() {
  return (
    <header className="px-24 py-4 w-full flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.png" alt="Posterity logo" width="150" height="75" />
      </Link>
      <ConnectWallet />
    </header>
  )
}
