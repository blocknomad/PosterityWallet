import { ConnectWallet } from "@thirdweb-dev/react";

export default function ConnectWalletBlock() {
  return (
    <div className="w-full p-20 flex justify-center">
      <ConnectWallet />
    </div>
  );
}
