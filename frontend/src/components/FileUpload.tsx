"use client";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import lighthouse from "@lighthouse-web3/sdk";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ethers } from "ethers";
import Upload from "../artifacts/contracts/Upload.sol/Upload.json"
// import { provider } from "@/app/mint/page";
import { encodeFunctionData } from "viem";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import NftHome from "./Minting";
import { WalletContextProvider, useWalletContext } from "@/context/wallet";
import Provider from "@/app/context/client-provider";


const FileUpload = ({ isModalOpen, setIsModalOpen }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [account, setAccount] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxTotalSize = 500 * 1024 * 1024; // 500MB in bytes
  const router = useRouter()
  const { userId, sessionId, getToken } = useAuth();

  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );

  const [fileName, setFileName] = useState("No File selected");
  const [fileSize, setFileSize] = useState()
  const lightapi = "e1cf40be.f167a3dacc7f4c95a3ba4fe9120f08c3";
  const [loading, setLoading] = useState(false)

  const { sendTransaction } = usePrivy();

  const { wallets } = useWallets();

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - ((progressData?.total || 0) / (progressData?.uploaded || 1)) * 100;
    console.log(percentageDone);
  };

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');


  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const eip1193provider = await embeddedWallet.getEthereumProvider();
        const signerAddress = embeddedWallet.address
        const { message } = (await lighthouse.getAuthMessage(embeddedWallet.address)).data
        const signature = await eip1193provider.request({
          method: "personal_sign",
          params: [message, embeddedWallet.address],
        })
        return { signature, signerAddress }
      } catch (error) {
        console.error("Error signing message with Wallet", error)
        return null
      }
    } else {
      console.log("Please install Wallet!")
      return null
    }
  }


  // const uploadFile = async (file) => {
  //   setFileName(file[0].name)
  //   setFileSize(file[0].size)
  //   setLoading(true);
  //   try {


  //     const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  //     await embeddedWallet.switchChain(84532);

  //     const alchemyKey = "wss://base-sepolia.g.alchemy.com/v2/JsC7CASSssdGpZ6rOrmEw9tYdn6-oJPd"
  //     const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
  //     const web3 = createAlchemyWeb3(alchemyKey);

  //     const contractAddress = '0x0ae88c1852E683b9907E69b7a4F96d09B3A35b84';

  //     const helloWorldContract = new web3.eth.Contract(
  //       Upload.abi,
  //       contractAddress,
  //     );

  //     const unsignedTx = {
  //       to: '0x0ae88c1852E683b9907E69b7a4F96d09B3A35b84',
  //       chainId: 84532,
  //       data: encodeFunctionData({
  //         abi: Upload.abi,
  //         functionName: 'uploadFile',
  //         args: [`https://gateway.lighthouse.storage/ipfs/`, "sm", "12", "test"]
  //       })
  //     }

  //     const uiConfig = {
  //       header: 'Sample header text',
  //       description: 'Transaction',
  //       buttonText: 'Confirm'
  //     };

  //     const txReceipt = await sendTransaction(unsignedTx, uiConfig);

  //     console.log(txReceipt)



  //     toast.info('File Uploading to blockchain - Processing...', {
  //       position: toast.POSITION.BOTTOM_RIGHT,
  //     });
  //     const output = await lighthouse.upload(
  //       file,
  //       lightapi,
  //       false,
  //       null,
  //       progressCallback
  //     );
  //     console.log("File Status:", output);
  //     const walletData = {
  //       email: output.data.Hash,
  //       address: embeddedWallet.address,
  //     };
  //     const wallRes = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wallet/add-wallet`, walletData);
  //     console.log(wallRes)
  //     console.log(
  //       "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
  //     );
  //     return output.data.Hash;
  //   } finally {
  //     setLoading(false);
  //     setIsModalOpen(false);
  //     setFileName("No File selected")
  //     setFileSize(null)

  //   }
  // };

  const uploadEncryptedFile = async (file) => {
    setLoading(true);

    if (!file) {
      console.error("No file selected.")
      return
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage()
      if (!encryptionAuth) {
        console.error("Failed to sign the message.")
        return
      }

      const { signature, signerAddress } = encryptionAuth

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        lightapi,
        signerAddress,
        signature,
        progressCallback
      )
      console.log("Encrypted File Status:", output)
      /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
      // If successful, log the URL for accessing the file
      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      )
      toast.info('File Uploading to blockchain - Processing...', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Error uploading encrypted file:", error)
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setFileName("No File selected")
      setFileSize(null)

    }
  }


  const { isLoaded, isSignedIn, user } = useUser();
  console.log(user?.primaryEmailAddress.emailAddress)

  const {
    organization: currentOrganization,
  } = useOrganization();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }, []);

  const onChange = (event) => {
    addFiles(event.target.files);
  };

  const addFiles = (newFiles: FileList) => {
    const filesArray = Array.from(newFiles);
    const sizeOfNewFiles = filesArray.reduce(
      (total, file) => total + file.size,
      0
    );

    if (totalSize + sizeOfNewFiles > maxTotalSize) {
      // Handle the error, e.g., show an alert or a message on the UI
      alert("Cannot add these files. Total upload size would exceed 500MB.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...filesArray]);
    setTotalSize((prevTotalSize) => prevTotalSize + sizeOfNewFiles);
  };

  console.log(fileSize)

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
    // Also update the total size state
    setTotalSize(
      (prevTotalSize) =>
        prevTotalSize - files.find((file) => file.name === fileName)?.size || 0
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      // Handle the case where no file is selected
      alert('Please select one or more files to upload.');
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('email', user?.primaryEmailAddress.emailAddress);
    formData.append('domainId', currentOrganization.id);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Session_id': sessionId,
        },
      });
      // Handle the response as needed
      console.log('File upload success:', response.data);
      toast.success(`file uploaded`, {
        pauseOnHover: true,
        theme: 'colored',
        progressStyle: { background: 'rgb(216 180 254)' },
        style: { background: 'rgb(126 34 206)' },
      });
      await window.location.reload()

      // Clear the state after successful upload
      setFiles([]);
      setTotalSize(0);

      // Close the modal
      closeModal();


    } catch (error) {
      // Handle errors
      console.error('File upload failed:', error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (

    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-transparent w-full">
                  <div className="container mx-auto max-w-screen-sm p-6">
                    <form

                      className="text-black flex flex-col items-center justify-center rounded-lg w-full"
                    >

                      <label
                        htmlFor="file-upload"
                        className="mb-5 cursor-pointer py-2 flex justify-center text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold"
                      >
                        {loading ? "Uploading..." : "Choose File"}
                      </label>
                      <input
                        // disabled={!account}
                        type="file"
                        className="hidden"
                        id="file-upload"
                        name="data"
                        onChange={(e) => {
                          uploadEncryptedFile(e.target.files);
                        }}
                      />

                      <span className="flex justify-center items-center font-semibold text-black">
                        File: {fileName}
                      </span>

                      {/* <button
          type="submit"
          className="cursor-pointer mt-5 w-full py-2 flex justify-center text-white items-center bg-green-500 hover:shadow-xl hover:bg-green-600 rounded-md px-4 text-sm font-semibold"
          disabled={!file}
        >
          Upload File
        </button> */}
                    </form>

                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >

  );
};

export default FileUpload;
