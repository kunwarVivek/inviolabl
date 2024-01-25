'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { useSmartAccount } from "../../hooks/SmartAccountContext";
import { BASE_GOERLI_SCAN_URL, NFT_ADDRESS } from "../../abiJson/constants";
import { encodeFunctionData } from "viem";
import ABI from "../../abiJson/nftABI.json";
import { ToastContainer, toast } from "react-toastify";
import { Alert } from "../../components/AlertWithLink";
import Header from "@/components/Header";


export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { sendTransaction } = usePrivy();

  const {
    smartAccountAddress,
    smartAccountProvider,
    sendSponsoredUserOperation,
    eoa,
  } = useSmartAccount();

  // If the user is not authenticated, redirect them back to the landing page
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const isLoading = !smartAccountAddress || !smartAccountProvider;
  const [isMinting, setIsMinting] = useState(false);

  const onMint = async () => {
    // The mint button is disabled if either of these are undefined
    if (!smartAccountProvider || !smartAccountAddress) return;

    // Store a state to disable the mint button while mint is in progress
    setIsMinting(true);
    const toastId = toast.loading("Minting...");

    try {
      // From a viem `RpcTransactionRequest` (e.g. calling an ERC-721's `mint` method),
      // build and send a user operation. Gas fees will be sponsored by the Base Paymaster.
      const userOpHash = await sendSponsoredUserOperation({
        from: smartAccountAddress,
        to: NFT_ADDRESS,
        data: encodeFunctionData({
          abi: ABI,
          functionName: "mint",
          args: [smartAccountAddress],
        }),
      });

      toast.update(toastId, {
        render: "Waiting for your transaction to be confirmed...",
        type: "info",
        isLoading: true,
      });

      // Once we have a hash for the user operation, watch it until the transaction has
      // been confirmed.
      const transactionHash =
        await smartAccountProvider.waitForUserOperationTransaction(userOpHash);

      toast.update(toastId, {
        render: (
          <Alert href={`${BASE_GOERLI_SCAN_URL}/tx/${transactionHash}`}>
            Successfully minted! Click here to see your transaction.
          </Alert>
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Mint failed with error: ", error);
      toast.update(toastId, {
        render: (
          <Alert>
            There was an error sending your transaction. See the developer
            console for more info.
          </Alert>
        ),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }

    setIsMinting(false);
  };


 function SendTransactionButton() {

  // Replace this with the UnsignedTransactionRequest you'd like your user to send
  const unsignedTx = {
    to: '0x82074bFb2F39E93b93a6dD6071Bb725727A1B664',
    chainId: 1,
    value: '0x3B9ACA00',
  };

  // Replace this with the text you'd like on your transaction modal
  const uiConfig = {
    header: 'Sample header text',
    description: 'Transaction',
    buttonText: 'Confirm'
  };

  // Users must have an embedded wallet at `user.wallet` to send a transaction.
  return (
    <button disabled={!user.wallet} onClick={async () => {
        const txReceipt = await sendTransaction(unsignedTx, uiConfig);
        // `txReceipt` is an object of type `TransactionReceipt`. From this object, you can
        // access your transaction's `transactionHash`, `blockNumber`, `gasUsed`, and
        // more.
    }}>
        Send ETH
    </button>);
}

  return (
    <>
    
      <Head>
        <title>Transact</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
      <header className="w-full">
        <Header className={"z-0 max-w-full absolute"} />
      </header>
        {ready && authenticated  ? (
          <>
            <ToastContainer />
            <div className="flex mt-10 flex-row justify-between">
              <h1 className="text-2xl font-semibold">
                Initiate Transaction
              </h1>
              
            </div>
            <div className="mt-12 flex gap-4 flex-wrap">
              <button
                onClick={SendTransactionButton}
                className="text-sm bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 py-2 px-4 rounded-md text-white"
                
              >
                <SendTransactionButton />
              </button>
              
            </div>
            
            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            />
          </>
        ) : null}
      </main>
    </>
  );
}
