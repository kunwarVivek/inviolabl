"use client";
import Dashboard from "@/components/Dashboard";
import React, { useState, useEffect } from "react";
import { ShareIcon } from "@heroicons/react/24/solid";
import DropdownMenu from "@/components/DropdownMenu";
// import { useValidation } from "@/components/Validation";
import loading from "@/app/loading";
import { OrganizationList, useAuth, useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { ethers } from "ethers";
import Upload from "../../../../artifacts/contracts/Upload.sol/Upload.json";
import lighthouse from "@lighthouse-web3/sdk";
import { fileInfoType } from "@lighthouse-web3/sdk/dist/Lighthouse/getFileInfo";


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



  const userDetails = useSelector(
    (state: RootState) => state.user.details
  );

  console.log(userDetails?.primaryEmailAddress?.emailAddress)


  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = "0x82074bFb2F39E93b93a6dD6071Bb725727A1B664";
        const wallRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wallet/all-wallets`);
        setData(wallRes.data.wallets);

        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        setContract(contract)

        const matchingObject = wallRes.data.wallets.find(obj => obj.email === userDetails?.primaryEmailAddress?.emailAddress);

        const dataArray = await contract.display(matchingObject.address);
        const str = dataArray.toString();
        const str_array = str.split(",");
        console.log(dataArray);

        const getCIDFromUrl = (url) => {
          const parts = url.split('/');
          return parts[parts.length - 1];
        };

        const lighthouseUrls = str_array.filter(url => url.includes('lighthouse.storage'));
        const cids = lighthouseUrls.map(getCIDFromUrl);

        const retrieveFileInfoForCids = async () => {
          const fileInfoArray = [];

          for (const cid of cids) {
            try {
              const fileInfoResult = await lighthouse.getFileInfo(cid);
              fileInfoArray.push(fileInfoResult.data);
            } catch (error) {
              console.error(`Error retrieving file info for CID ${cid}: ${error.message}`);
            }
          }

          console.log(fileInfoArray);
          setFileDetails(dataArray);
        };

        retrieveFileInfoForCids();
        setTriggerEffect(false);
        setTriggerDownload(false)
      } catch (error) {
        console.error(`Error retrieving file details: ${error.message}`);
      }
    };

    fetchFileDetails();
  }, [triggerEffect,triggerDownload]);


  console.log(fileDetails)

  const [pdfOpened, setPdfOpened] = useState(false);

  const handleFileClick = async (file, index, account) => {

    try {

      setLoading(true);

      const transaction = await contract.addView(account, index);


      await transaction.wait();

      console.log('addview function called successfully');
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
      await transaction.wait();
      console.log('addDownload function called successfully');
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
                  <td className="px-5 py-5 pl-10 border-b border-gray-200 bg-white text-sm">
                    <button

                      onClick={() => handleFileClick(file, index, account)}
                    >
                      <span>{file.fileName}</span>
                    </button>
                    <button
                      onClick={() => handleFileDownload(file, index, account)}
                      className="ml-2 hover:text-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.fileSize}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.emailAddress}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.views == 0 ? "no views" : Number(file.views)}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.downloads == 0 ? "no downloads" : Number(file.downloads)}</td>

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
