"use client";
import Dashboard from "@/components/Dashboard";
import React, { useState, useEffect } from "react";
import DropdownMenu from "@/components/DropdownMenu";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { ethers } from "ethers";
import Upload from "../../../../artifacts/contracts/Upload.sol/Upload.json";
import lighthouse from "@lighthouse-web3/sdk";
import { toast } from "react-toastify";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
import Link from "next/link";


interface FileInfoType {
  fileSizeInBytes: string;
  cid: string;
  encryption: boolean;
  fileName: string;
  mimeType: string;

}


const page = ({ params }) => {
  const [fileDetails, setFileDetails] = useState(null);
  const [account, setAccount] = useState("");
  const [data, setData] = useState()
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [triggerDownload, setTriggerDownload] = useState(false)

  console.log(data)

  const { signMessage } = usePrivy();


  const userDetails = useSelector(
    (state: RootState) => state.user.details
  );

  console.log(userDetails?.primaryEmailAddress?.emailAddress)

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  console.log(embeddedWallet?.address)


  const [email, setEmail] = useState([]);
  const [cid, setCid] = useState([]);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {

        const response = await lighthouse.getUploads("e1cf40be.f167a3dacc7f4c95a3ba4fe9120f08c3")
        console.log(response)
        setFileDetails(response.data.fileList)
        // const wallRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wallet/all-wallets`);
        // console.log(wallRes.data.wallets);

        // // Assuming userDetails and setEmail, setFileDetails, setData are defined elsewhere
        // const matchingObject = wallRes.data.wallets.find(obj => obj.address == embeddedWallet?.address);
        // console.log(matchingObject)
        // setCid(matchingObject)

        // if (matchingObject) {
        //   const lighthouseUrl = matchingObject.email;
        //   console.log(lighthouseUrl)

        //   try {
        //     const fileInfoResult = await lighthouse.getFileInfo(lighthouseUrl);
        //     const fileDetails = fileInfoResult.data;
        //     console.log(fileDetails);
        //     setFileDetails([fileDetails]); // Set file details as an array
        //   } catch (error) {
        //     console.error(`Error retrieving file info for CID ${cid}: ${error.message}`);
        //   }
        // }

        // // Assuming these functions and states are defined elsewhere
        // setTriggerEffect(false);
        // setTriggerDownload(false);
      } catch (error) {
        console.error(`Error retrieving file details: ${error.message}`);
      }
    };

    fetchFileDetails();
  }, [triggerEffect, triggerDownload]);




  console.log(fileDetails)

  console.log(email)
  console.log(cid)

  const [pdfOpened, setPdfOpened] = useState(false);

  const handleFileClick = async (file, index, account) => {

    try {

      setLoading(true);

      const transaction = await contract.addView(account, index);

      toast.info('Processing transaction...', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });

      await transaction.wait();

      console.log('addview function called successfully');
      toast.dismiss();

      toast.success('transaction successfull', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error calling addview function:', error);
      return;
    } finally {

      setLoading(false);
      setTriggerEffect(true);
    }


    window.open(file.url, '_blank');
    setPdfOpened(true);
  };

  const handleFileDownload = async (file, index, account) => {

    try {

      const transaction = await contract.addDownload(account, index);
      toast.info('Processing transaction...', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
      await transaction.wait();
      console.log('addDownload function called successfully');
      toast.dismiss();

      toast.success('transaction successfull', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error calling addDownload function:', error);
      return;
    }

    fetch(file.fileName).then((response) => {
      response.blob().then((blob) => {

        // Creating new object of PDF file
        const fileURL =
          window.URL.createObjectURL(blob);

        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = file.fileName;
        alink.click();
      });
    });
    setTriggerDownload(true);
  };

  console.log(userDetails)

  const { user } = useUser();

  const [userFiles, setUserFiles] = useState([]);
  console.log(userFiles)



  const [filter, setFilter] = useState('all');
  const [fileHistory, setFileHistory] = useState([
    // { filename: "resume.pdf", size: "1mb", createdAt: "yesterday", status: "Success" },
  ]);
  console.log(filter);

  const filteredFileHistory = filter === 'all'
    ? fileHistory
    : fileHistory.filter(file => file && file.filename && file.filename.endsWith(`.${filter.toLowerCase()}`));

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter.toLowerCase());
  };
  const typeOptions = ["All", "PDF", "JPG", "PNG", "JPEG"];
  const modifiedOptions = ["Today", "Last Week", "Last Month"];

  function ExportWalletButton() {
    const { ready, authenticated, user, exportWallet } = usePrivy();

    // Check that your user is authenticated
    const isAuthenticated = ready && authenticated;

    // Check that your user has an embedded wallet

    return (
      <button
        onClick={exportWallet}
        disabled={!isAuthenticated}
      >
        Export my wallet
      </button>
    );
  }

  // function downloadFile(file) {
  //   // Replace 'file.cid' with the actual file name or identifier
  //   const fileName = file.fileName
  //   const downloadUrl = `https://gateway.lighthouse.storage/ipfs/${file.cid}`;

  //   // Create a temporary link element
  //   const link = document.createElement('a');
  //   link.href = downloadUrl;
  //   link.download = fileName;

  //   // Append the link to the document
  //   document.body.appendChild(link);

  //   // Trigger the click event to start the download
  //   link.click();

  //   // Remove the link from the document
  //   document.body.removeChild(link);
  // }

  // const downloadFile = async (lighthouse_cid) => {
  //   const axios = require('axios');
  //   const lighthouseDealDownloadEndpoint = 'https://gateway.lighthouse.storage/ipfs/';

  //   try {
  //     let downloadResponse = await axios({
  //       method: 'GET',
  //       url: `${lighthouseDealDownloadEndpoint}${lighthouse_cid}`,
  //       responseType: 'stream',
  //     });

  //     // Handle the download response as needed
  //     console.log('Download successful!', downloadResponse);
  //   } catch (error) {
  //     // Handle errors
  //     console.error('Download failed:', error);
  //   }
  // };


  const downloadFile = async (cid, path) => {
    const lighthouseDealDownloadEndpoint = 'https://gateway.lighthouse.storage/ipfs/';

    try {
      const downloadResponse = await axios({
        method: 'GET',
        url: `${lighthouseDealDownloadEndpoint}${cid}`,
        responseType: 'arraybuffer', // Set responseType to 'blob' for binary data
      });

      const blob = new Blob([downloadResponse.data], { type: downloadResponse.headers['content-type'] });


      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = path.split('/').pop(); // Set the file name based on the path
      link.click();

      console.log('File downloaded successfully.');
    } catch (error) {
      console.error('Error downloading file:', error.message);
      throw error; // rethrow the error for further handling if needed
    }
  };

  const uiConfig = {
    title: 'Sign',
    description: 'Signature',
    buttonText: 'Confirm'
};

  const shareFile = async (cidHash:any) => {
    try {
        // CID of the encrypted file that you want to share
        // CID is generated by uploading a file with encryption
        // Only the owner of the file can share it with another wallet address
        const cid = cidHash // Example: "Qma7Na9sEdeM6aQeu6bUFW54HktNnW2k8g226VunXBhrn7";
        const publicKey = embeddedWallet.address // Example: "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
        const messageRequested = (await lighthouse.getAuthMessage(embeddedWallet.address)).data.message
        const signedMessage = await signMessage(messageRequested, uiConfig);

        const publicKeyUserB = ["0xf3A88e11B2252643615A457941f22aCa655DB47a"] //Example: 0x487fc2fE07c593EAb555729c3DD6dF85020B5160

        const shareResponse = await lighthouse.shareFile(
            publicKey,
            publicKeyUserB,
            cid,
            signedMessage
        )

        console.log(shareResponse)
        toast.info(`FIle access shared to ${shareResponse.data.shareTo[0]}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
    } catch (error) {
        console.log(error)
    }
}


  return (

    <div className="bg-white min-h-screen">
      <Dashboard>
        <div className="overflow-x-auto min-h-screen bg-white rounded-md border shadow-2xl">
          <table className="min-w-full bg-white ">
            <thead className="bg-white text-black ">
              <tr>
                <th colSpan={5} className="py-2">
                  <div className="pl-10 py-5 bg-slate-100 text-start space-x-4 mt-14 mb-2">
                    <span className="font-semibold text-xl">File History</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={5} className="py-2">
                  <div className="mr-10 flex justify-end text-start space-x-4 mb-5">
                    <DropdownMenu buttonText="Type" options={typeOptions} onSelect={handleFilterChange} />
                    <DropdownMenu
                      buttonText="Modified"
                      options={modifiedOptions}
                      onSelect={handleFilterChange}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            {/* <ExportWalletButton /> */}

            <thead>
              <tr>
                <th
                  className="px-5 pl-10 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  FILE NAME
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  SIZE
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  UPLOADED BY
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  NO OF VIEWS
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  NO OF DOWNLOADS
                </th>
                {/* <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  UPLOADED ON
                </th>

                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  UPLOADED BY
                </th> */}

              </tr>
            </thead>

            <tbody className="text-gray-700">
              {fileDetails?.map((file, index) => (


                <tr key={index}>
                  <td className="px-5 py-5 pl-10 border-b flex border-gray-200 bg-white text-sm">
                    <button

                      onClick={() => handleFileClick(file, index, account)}
                    >
                      <span>{file.fileName}</span>
                    </button>

                    <button onClick={() => downloadFile(file.cid, "/")} className="ml-2 hover:text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                      </svg>
                    </button>
                    <button onClick={() => shareFile(file.cid)} className="ml-2 hover:text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512">
                        <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z" /></svg>
                    </button>

                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.fileSizeInBytes}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{userDetails?.primaryEmailAddress?.emailAddress}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{0}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{0}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dashboard>
    </div>

  );
};

export default page;
