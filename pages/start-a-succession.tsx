import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useSDK, useAddress } from "@thirdweb-dev/react";

import Button from "./components/Button";
import CONSTANTS from "../utils/constants";
import PosterityWalletFactoryABI from "../abis/PosterityWalletFactory.json";
import PosterityWalletABI from "../abis/PosterityWallet.json";
import Spinner from "./components/Spinner";
import ConnectWalletBlock from "./components/ConnectWalletBlock";

interface Successor {
  walletAddress: string;
  taxId: string;
  succeeded: boolean;
}

const SuccessorTile = ({ successor }: { successor: Successor }) => {
  const [isSucceedingWallet, setIsSucceedingWallet] = useState(false);
  const sdk = useSDK();

  const handleSuccession = async () => {
    try {
      setIsSucceedingWallet(true);

      const posterityWalletContract = await sdk?.getContract(
        successor.walletAddress,
        PosterityWalletABI.abi
      );

      await posterityWalletContract
        ?.call("requestOracle")
        .then(() => {
          const unsubscribe = posterityWalletContract.events.addEventListener(
            "ResponseSituation",
            (event: any) => {
              console.log(12312312, event);
              if (event == "Cancelada") {
                successor.succeeded = true;
              }
            }
          );
          console.log("request ocr");

          unsubscribe();
        })
        .catch((error) => {
          alert(error);
        });
    } catch (e) {
      alert(e);
    } finally {
      setIsSucceedingWallet(false);
    }
  };

  return (
    <div className="py-4 border-b border-gray-200 last:border-0 flex items-center justify-between">
      <div className="space-y-1">
        <p className="">{successor.walletAddress}</p>
        <p className="text-sm text-gray-500">{successor.taxId}</p>
      </div>
      {successor.succeeded ? (
        <Button size="small" success={successor.succeeded}>
          Wallet succeeded
        </Button>
      ) : isSucceedingWallet ? (
        <Button size="small" disabled>
          Starting succession...
        </Button>
      ) : (
        <Button size="small" onClick={handleSuccession}>
          Start succession
        </Button>
      )}
    </div>
  );
};

export default function RecoverWallet() {
  const [isLoadingSuccessorWallets, setIsLoadingSuccessorWallets] =
    useState(true);
  const [successorsWallets, setSuccessorsWallets] = useState<Successor[]>([]);
  const address = useAddress();
  const sdk = useSDK();
  const posterityWalletFactoryContract = sdk?.getContractFromAbi(
    `${CONSTANTS.POSTERITY_WALLET_FACTORY_CONTRACT}`,
    PosterityWalletFactoryABI.abi
  );

  const getSuccessorWallets = async () => {
    (await posterityWalletFactoryContract)
      ?.call("getPosterityWalletsFromHeir", [address])
      .then(async function (wallets: any) {
        const auxWallets = await Promise.all(
          wallets.map(async (wallet: string) => {
            const posterityWalletContract = await sdk?.getContract(
              wallet,
              PosterityWalletABI.abi
            );
            const succeeded = await posterityWalletContract?.call("succession");

            return { walletAddress: wallet, succeeded };
          })
        );

        setSuccessorsWallets(auxWallets);
      })
      .catch((e) => {
        alert(e);
      })
      .finally(function () {
        setIsLoadingSuccessorWallets(false);
      });
  };

  useEffect(() => {
    setIsLoadingSuccessorWallets(true);

    if (address) {
      getSuccessorWallets();
    }
  }, [address]);

  const getContent = () => {
    if (successorsWallets.length > 0) {
      return (
        <div className="w-[600px]">
          {successorsWallets.map((successor) => (
            <SuccessorTile
              key={successor.walletAddress}
              successor={successor}
            />
          ))}
        </div>
      );
    } else {
      return (
        <p className="text-base">
          You still haven&apos;t been added as an heir in a Posterity Wallet.
        </p>
      );
    }
  };

  if (!address) {
    return <ConnectWalletBlock />;
  }

  if (isLoadingSuccessorWallets) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Recover wallet</title>
        <meta
          name="description"
          content="A thoughtful way to show love to those who matter to you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-48 py-12">
        <div className="flex items-center space-x-5">
          <h1 className="text-3xl font-bold">Start a succession</h1>
        </div>
        <div className="my-5 flex items-center">{getContent()}</div>
      </main>
    </>
  );
}
