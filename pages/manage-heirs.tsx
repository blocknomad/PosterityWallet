import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSDK, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import Button from "./components/Button";
import Input from "./components/Input";
import SvgButton from "./components/SvgButton";
import CONSTANTS from "../utils/constants";
import PosterityWalletFactoryABI from "../abis/PosterityWalletFactory.json";
import PosterityWalletABI from "../abis/PosterityWallet.json";
import Spinner from "./components/Spinner";
import Link from "next/link";
import ConnectWalletBlock from "./components/ConnectWalletBlock";

interface Heir {
  userAddress: string;
  percentage: number;
}

const HeirTile = ({ heir }: { heir: Heir }) => {
  return (
    <div className="py-4 border-b border-gray-200 last:border-0 flex justify-between">
      <p className="">{heir.userAddress}</p>
      <div className="flex items-center space-x-2">
        <p className="">{heir.percentage.toString()}%</p>
        <div className="w-[40px] h-[8px] rounded-md bg-gray-100 overflow-hidden">
          <div className="bg-primary" style={{ width: `${heir.percentage}%` }}>
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

const HeirsForm = ({
  heirs,
  onCancel,
  handleHeirsModification,
}: {
  heirs: Heir[];
  onCancel: () => void;
  handleHeirsModification: (heirs: Heir[]) => void;
}) => {
  const [isSavingHeirs, setIsSavingHeirs] = useState(false);
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      heirs: heirs.length > 0 ? heirs : [{ userAddress: "", percentage: 0 }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "heirs", // unique name for your Field Array
    }
  );

  const onSubmit = async ({ heirs }: { heirs: Heir[] }) => {
    setIsSavingHeirs(true);

    try {
      await handleHeirsModification(
        heirs.map(({ userAddress, percentage }) => ({
          userAddress,
          percentage: Number(percentage),
        }))
      );
    } catch (error) {
      alert(error);
      setIsSavingHeirs(false);
    }
  };

  const onError = (errors: any) => {
    alert(
      "Error validating the form. Ensure that you provided valid addresses and percentages."
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="w-[600px]">
      <div>
        {fields.map((field, index) => (
          <div
            className="py-4 border-b border-gray-200 last:border-0 flex space-x-2 flex items-center"
            key={field.id}
          >
            <Input
              className="grow"
              placeholder="Heir wallet address"
              {...register(`heirs.${index}.userAddress`, {
                required: true,
                validate: {
                  address: (address: string) => {
                    return ethers.utils.isAddress(address);
                  },
                },
              })}
            />
            <Input
              className="w-[70px]"
              maxLength="5"
              placeholder="Percentage"
              {...register(`heirs.${index}.percentage`, {
                required: true,
                min: 0,
                max: 100,
              })}
            />
            <SvgButton onClick={() => remove(index)}>
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </SvgButton>
          </div>
        ))}
      </div>
      <Button
        onClick={() => append({ userAddress: "", percentage: 0 })}
        type="button"
        className="w-full"
        variant="secondary"
        size="small"
      >
        Add heir
      </Button>
      <hr className="my-5 border-t border-gray-200" />
      <div className="space-y-2">
        {isSavingHeirs ? (
          <Button className="w-full" variant="primary" disabled>
            Saving heirs...
          </Button>
        ) : (
          <Button onClick={() => null} className="w-full" variant="primary">
            Save heirs
          </Button>
        )}
        <Button
          onClick={onCancel}
          type="button"
          className="w-full"
          variant="secondary"
          disabled={isSavingHeirs}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default function Home() {
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [isLoadingHeirs, setIsLoadingHeirs] = useState(true);
  const [isModifyingHeirs, setIsModifyingHeirs] = useState(false);
  const [userPosterityWallet, setUserPosterityWallet] = useState<string | null>(
    null
  );
  const address = useAddress();
  const sdk = useSDK();
  const posterityWalletFactoryContract = sdk?.getContract(
    CONSTANTS.POSTERITY_WALLET_FACTORY_CONTRACT,
    PosterityWalletFactoryABI.abi
  );
  let posterityWalletContract = useRef<any>();

  const getHeirs = async () => {
    (await posterityWalletFactoryContract)
      ?.call("getPosterityWallet", [address])
      .then(async function (posterityWalletAddress: any) {
        if (
          posterityWalletAddress ===
          "0x0000000000000000000000000000000000000000"
        ) {
          setUserPosterityWallet(null);
          setIsLoadingHeirs(false);
        } else {
          setUserPosterityWallet(posterityWalletAddress);

          posterityWalletContract.current = await sdk?.getContract(
            posterityWalletAddress,
            PosterityWalletABI.abi
          );

          const heirs = await posterityWalletContract.current?.call("getHeirs");
          setHeirs([...heirs]);
        }
      })
      .catch((e) => {
        alert(e);
      })
      .finally(function () {
        setIsLoadingHeirs(false);
      });
  };

  useEffect(() => {
    setIsLoadingHeirs(true);

    if (address) {
      getHeirs();
    }
  }, [address]);

  const handleHeirsModification = async (heirs: Heir[]) => {
    const fHeirs = heirs.map(({ userAddress, percentage }) => [
      userAddress,
      percentage,
    ]);
    await posterityWalletContract.current?.call("changeHeirs", [fHeirs]);
    setHeirs(heirs);
    setIsModifyingHeirs(false);
  };

  const getContent = () => {
    if (isModifyingHeirs) {
      return (
        <HeirsForm
          heirs={heirs}
          onCancel={() => setIsModifyingHeirs(false)}
          handleHeirsModification={handleHeirsModification}
        />
      );
    } else if (!userPosterityWallet) {
      return (
        <p className="text-base">
          You still don&apos;t have a Posterity Wallet. Go to{" "}
          <Link href="/posterity-wallet" className="text-primary">
            Posterity Wallet
          </Link>{" "}
          and click on the &quot;Create&quot; button to create one.
        </p>
      );
    } else if (heirs.length > 0) {
      return (
        <div className="w-[600px]">
          {heirs
            .sort((a, b) => b.percentage - a.percentage)
            .map((heir) => (
              <HeirTile key={heir.userAddress} heir={heir} />
            ))}
        </div>
      );
    } else {
      return (
        <p className="text-base">
          There aren&apos;t heirs to show. Click on the &quot;Modify heirs&quot;
          button above to add heirs.
        </p>
      );
    }
  };

  if (!address) {
    return <ConnectWalletBlock />;
  }

  if (isLoadingHeirs) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Manage heirs</title>
        <meta
          name="description"
          content="A thoughtful way to show love to those who matter to you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-48 py-12">
        <div className="flex items-center space-x-5">
          <h1 className="text-3xl font-bold">Manage heirs</h1>
          {isModifyingHeirs || !userPosterityWallet ? null : (
            <Button size="small" onClick={() => setIsModifyingHeirs(true)}>
              Modify heirs
            </Button>
          )}
        </div>
        <div className="my-5 flex items-center">{getContent()}</div>
      </main>
    </>
  );
}
