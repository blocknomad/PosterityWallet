import Image from "next/image";
import Link from "next/link";
import { ConnectWallet, useSwitchChain } from "@thirdweb-dev/react";
import { useAddress, useNetworkMismatch, ChainId } from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function Header() {
  const address = useAddress(); // Get connected wallet address
  const switchChain = useSwitchChain(); // Switch to desired chain
  const isMismatched = useNetworkMismatch(); // Detect if user is connected to the wrong network

  useEffect(() => {
    // Check if the user is connected to the wrong network
    if (isMismatched) {
      // Prompt their wallet to switch networks
      switchChain(ChainId.Goerli); // the chain you want here
    }
  }, [address]);

  return (
    <header className="px-48 py-4 shadow border-gray-200 w-full flex items-center space-x-8">
      <Link href="/">
        <Image src="/logo.png" alt="Posterity logo" width="150" height="64" />
      </Link>
      <div className="grow" />
      <div className="items-center space-x-5">
        <Link href="/posterity-wallet">Posterity Wallet</Link>
        <Link href="/manage-heirs">Manage heirs</Link>
        <Link href="/start-a-succession">Start a succession</Link>
      </div>
      <ConnectWallet />
    </header>
  );
}
