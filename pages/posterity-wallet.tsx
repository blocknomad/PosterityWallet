import Head from "next/head";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { useSDK, useAddress } from "@thirdweb-dev/react";
import { useForm } from "react-hook-form";

import Button from "./components/Button";
import PosterityWalletFactoryABI from "../abis/PosterityWalletFactory.json";
import PosterityWalletABI from "../abis/PosterityWallet.json";
import Spinner from "./components/Spinner";
import Input from "./components/Input";
import CONSTANTS from "../utils/constants";
import ConnectWalletBlock from "./components/ConnectWalletBlock";

interface Transaction {
  to: string;
  from: string;
  value: any;
  hash: string;
}

const TransactionTile = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="py-4 border-b border-gray-200 last:border-0 flex justify-between">
      <p className="truncate w-1/3 pr-7">{transaction.from}</p>
      <p className="truncate w-1/3 pr-7">{transaction.to}</p>
      <p className="truncate w-1/3 pr-7">
        {ethers.utils.formatEther(transaction.value)} ETH
      </p>
    </div>
  );
};

const SendForm = ({
  userBalance,
  onCancel,
  handlePosterityWalletSend,
}: {
  userBalance: any;
  onCancel: () => void;
  handlePosterityWalletSend: any;
}) => {
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      address: "",
      amount: "",
    },
  });

  const onSubmit = async ({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }) => {
    setIsSending(true);
    setTxHash(null);

    if (isNaN(Number(amount))) {
      alert("Please inform a number as your amount");
      setIsSending(false);
      return;
    }

    try {
      const hash = await handlePosterityWalletSend({ address, amount });
      setTxHash(hash);
    } catch (error) {
      alert(error);
    } finally {
      setIsSending(false);
    }
  };

  const onError = (errors: any) => {
    alert(
      "Error validating the form. Ensure that you provided a valid address and amount."
    );
  };

  return (
    <div className="w-[600px]">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="border-b border-gray-200 last:border-0"
      >
        <div className="space-y-3 pt-8">
          <Input
            className="w-full"
            placeholder="Address"
            {...register("address", {
              required: true,
              validate: {
                address: (address: string) => {
                  return ethers.utils.isAddress(address);
                },
              },
            })}
          />
          <div className="flex items-center space-x-3">
            <Input
              className="w-full"
              placeholder="Amount"
              {...register("amount", {
                required: true,
                min: 0,
                validate: {
                  number: (amount) => {
                    return isNaN(amount) === false;
                  },
                },
              })}
            />
            <p className="text-sm whitespace-nowrap	">
              Max: {userBalance ? ethers.utils.formatEther(userBalance) : "0.0"}{" "}
              ETH
            </p>
          </div>
        </div>
        <hr className="my-5 border-t border-gray-200" />
        <div className="space-y-2">
          {isSending ? (
            <Button className="w-full" variant="primary" disabled>
              Sending...
            </Button>
          ) : (
            <Button className="w-full" variant="primary">
              Send
            </Button>
          )}
          <Button
            onClick={onCancel}
            className="w-full"
            variant="secondary"
            disabled={isSending}
          >
            Cancel
          </Button>
        </div>
      </form>
      {isSending === false && txHash ? (
        <div className="pt-10 flex items-center">
          <p className="text-base">Tx Hash: </p>&nbsp;
          <a
            href={`https://goerli.etherscan.io/tx/${txHash}`}
            target="_blank"
            className="text-primary max-w-[300px] truncate"
          >
            {txHash}
          </a>
        </div>
      ) : null}
    </div>
  );
};

const PosterityWalletForm = ({
  onCancel,
  handlePosterityWalletCreation,
}: {
  onCancel: () => void;
  handlePosterityWalletCreation: any;
}) => {
  const [isCreatingPosterityWallet, setIsCreatingPosterityWallet] =
    useState(false);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      taxId: "",
    },
  });

  const onSubmit = async ({ taxId }: { taxId: string }) => {
    setIsCreatingPosterityWallet(true);

    if (isNaN(Number(taxId))) {
      alert("Please inform a number as your tax ID");
      setIsCreatingPosterityWallet(false);
      return;
    }

    try {
      await handlePosterityWalletCreation(taxId);
    } catch (error) {
      alert(error);
      setIsCreatingPosterityWallet(false);
    }
  };

  const onError = (errors: any) => {
    alert("Error validating the form. Ensure that you informed a Tax ID.");
  };

  return (
    <div className="w-[600px]">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="border-b border-gray-200 last:border-0"
      >
        <Input
          className="w-full"
          placeholder="Your tax ID"
          {...register("taxId", {
            required: true,
          })}
        />
        <hr className="my-5 border-t border-gray-200" />
        <div className="space-y-2">
          {isCreatingPosterityWallet ? (
            <Button className="w-full" variant="primary" disabled>
              Creating...
            </Button>
          ) : (
            <Button className="w-full" variant="primary">
              Create
            </Button>
          )}
          <Button
            onClick={onCancel}
            className="w-full"
            variant="secondary"
            disabled={isCreatingPosterityWallet}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function PosterityWallet() {
  const [isLoadingPosterityWallet, setIsLoadingPosterityWallet] =
    useState(true);
  const [userPosterityWallet, setUserPosterityWallet] = useState<string | null>(
    null
  );
  const [userPosterityWalletBalance, setUserPosterityWalletBalance] =
    useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isCreatingPosterityWallet, setIsCreatingPosterityWallet] =
    useState(false);
  const [isSending, setIsSending] = useState(false);
  const address = useAddress();
  const etherscanProvider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
  );
  const sdk = useSDK();
  const posterityWalletFactoryContract = sdk?.getContract(
    CONSTANTS.POSTERITY_WALLET_FACTORY_CONTRACT,
    PosterityWalletFactoryABI.abi
  );

  const getPosterityWalletTransaction = async (
    posterityWalletAddress: string
  ) => {
    setIsLoadingTransactions(true);

    etherscanProvider
      .getHistory(posterityWalletAddress)
      .then((history: any) => {
        setTransactions(history.slice(0, 10));
        setIsLoadingTransactions(false);
      });
  };

  const getPosterityWalletBalance = async (posterityWalletAddress?: string) => {
    if (!posterityWalletAddress) return;

    const balance = await sdk?.getProvider().getBalance(posterityWalletAddress);
    setUserPosterityWalletBalance(balance);
  };

  const getPosterityWallet = async () => {
    (await posterityWalletFactoryContract)
      ?.call("getPosterityWallet", [address])
      .then(async function (posterityWalletAddress: any) {
        if (
          posterityWalletAddress ===
          "0x0000000000000000000000000000000000000000"
        ) {
          setUserPosterityWallet(null);
          setIsLoadingPosterityWallet(false);
        } else {
          setUserPosterityWallet(posterityWalletAddress);
          getPosterityWalletTransaction(posterityWalletAddress);
          await getPosterityWalletBalance(posterityWalletAddress);
          setIsLoadingPosterityWallet(false);
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(function () {
        setIsLoadingPosterityWallet(false);
      });
  };

  useEffect(() => {
    setIsLoadingPosterityWallet(true);

    if (address) {
      getPosterityWallet();
    }
  }, [address]);

  const handlePosterityWalletCreation = async (taxId: string) => {
    const response = await (
      await posterityWalletFactoryContract
    )?.call("deploy", [Number(taxId)]);
    const newPosterityWalletAddress = ethers.utils.getAddress(
      ethers.utils.hexStripZeros(response.receipt.logs[0].topics[2])
    );
    setIsCreatingPosterityWallet(false);
    setUserPosterityWallet(newPosterityWalletAddress);
    setUserPosterityWalletBalance(null);
  };

  const handlePosterityWalletSend = async ({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }) => {
    const posterityWalletContract = await sdk?.getContract(
      userPosterityWallet,
      PosterityWalletABI.abi
    );
    const { receipt } = await (
      await posterityWalletContract
    )?.call("withdraw", [ethers.utils.parseEther(amount), address]);
    getPosterityWalletBalance(userPosterityWallet);
    return receipt.transactionHash;
  };

  const getPosterityWalletContent = () => {
    if (isCreatingPosterityWallet) {
      return (
        <PosterityWalletForm
          onCancel={() => setIsCreatingPosterityWallet(false)}
          handlePosterityWalletCreation={handlePosterityWalletCreation}
        />
      );
    } else {
      return (
        <p className="text-base">
          You still don&apos;t have a Posterity Wallet. Click on the
          &quot;Create&quot; button above to create one.
        </p>
      );
    }
  };

  const getTransactionsContent = () => {
    if (isLoadingTransactions) {
      return <Spinner />;
    } else if (transactions.length > 0) {
      return (
        <>
          <div className="py-2 flex">
            <p className="font-bold text-small w-1/3">From</p>
            <p className="font-bold text-small w-1/3">To</p>
            <p className="font-bold text-small w-1/3">Value</p>
          </div>
          {transactions.map((transaction) => (
            <TransactionTile transaction={transaction} key={transaction.hash} />
          ))}
        </>
      );
    } else {
      return (
        <p className="text-base">
          There aren&apos;t recent transactions to show.
        </p>
      );
    }
  };

  if (!address) {
    return <ConnectWalletBlock />;
  }

  if (isLoadingPosterityWallet) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Posterity Wallet</title>
        <meta
          name="description"
          content="A thoughtful way to show love to those who matter to you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-48 py-12">
        {userPosterityWallet ? (
          <>
            <div className="flex items-center space-x-5">
              <h1 className="text-3xl font-bold">Posterity Wallet</h1>
              <div className="bg-gray-100 truncate rounded-md py-1 px-3 max-w-[140px] text-sm">
                {userPosterityWallet}
              </div>
            </div>
            {isSending ? (
              <SendForm
                userBalance={userPosterityWalletBalance}
                onCancel={() => setIsSending(false)}
                handlePosterityWalletSend={handlePosterityWalletSend}
              />
            ) : (
              <>
                <div className="my-5 flex items-center">
                  <p className="text-5xl font-thin">
                    {userPosterityWalletBalance
                      ? ethers.utils.formatEther(userPosterityWalletBalance)
                      : "0.0"}{" "}
                    <span className="text-3xl">ETH</span>
                  </p>
                  {/*<Button size='small' className='ml-10'>Deposit</Button>*/}
                  <Button
                    size="small"
                    className="ml-10"
                    onClick={() => setIsSending(true)}
                  >
                    Send
                  </Button>
                </div>
                <hr className="my-8 border-t border-gray-200" />
                <div className="w-[700px]">
                  <h2 className="font-thin text-2xl mb-4">
                    Recent transactions
                  </h2>
                  {getTransactionsContent()}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-5">
              <h1 className="text-3xl font-bold">Posterity Wallet</h1>
              {isCreatingPosterityWallet ? null : (
                <Button
                  size="small"
                  onClick={() => setIsCreatingPosterityWallet(true)}
                >
                  Create
                </Button>
              )}
            </div>
            <div className="my-5 flex items-center">
              {getPosterityWalletContent()}
            </div>
          </>
        )}
      </main>
    </>
  );
}
