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

const page = async ({ params }) => {
  const [fileDetails, setFileDetails] = useState(null);

  const userDetails = useSelector(
    (state: RootState) => state.user.details
  );

  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );

  console.log(MetaMaskAccount)


  


  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        // Example: Array of CIDs
        const cids = ["QmTmGqgVUGf37dgEm3Uig1cuRe75zjpkWSPVGTYBduM198", /* ... other CIDs */];

        const fileInfoArray = await Promise.all(cids.map(async (cid) => {
          const fileInfoResult = await lighthouse.getFileInfo(cid);
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          let contractAddress = "0xA2C019a3DC84801B575C2a24c16D2820469C9F3d";

          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );



          console.log(contract)


          let dataArray = await contract.display(MetaMaskAccount);
          const str = dataArray.toString();
          const str_array = str.split(",");
          console.log(str_array)
          const getCIDFromUrl = (url) => {
            const parts = url.split('/');
            return parts[parts.length - 1];
          };

          const lighthouseUrls = str_array.filter(url => url.includes('lighthouse.storage'));

          const cids = lighthouseUrls.map(getCIDFromUrl);
          // console.log(cids);
          const fileInfoArray = [];

          const fileInfo = async (cid) => {
            try {
              const fileInfoResult = await lighthouse.getFileInfo(cid);
              fileInfoArray.push(fileInfoResult.data);
            } catch (error) {
              console.error(`Error retrieving file info for CID ${cid}: ${error.message}`);
            }
          };

          // Loop through each CID and retrieve file details
          const retrieveFileInfoForCids = async () => {
            for (const cid of cids) {
              await fileInfo(cid);
            }

            // Now, fileInfoArray contains an array of file details for each CID
            console.log(fileInfoArray);
            setFileDetails(fileInfoArray)
          };

          // Call the function to retrieve file details for each CID
          retrieveFileInfoForCids();
          return fileInfoResult.data;
        }));

        setFileDetails(fileInfoArray);
      } catch (error) {
        console.error(`Error retrieving file details: ${error.message}`);
      }
    };

    fetchFileDetails();
  }, []);

  console.log(fileDetails)





  console.log(userDetails)

  const { user } = useUser(); // Assuming you have a way to get the user ID

  const [userFiles, setUserFiles] = useState([]);
  console.log(userFiles)

  // useEffect(() => {
  //   const fetchUserFiles = async () => {

  //     try {
  //       if (currentOrganization.id) {
  //         const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants/${currentOrganization.id}/files`,
  //           {
  //             headers: {
  //               'Session_id': sessionId,
  //             }
  //           });
  //         setFileHistory(response.data);
  //         setUserFiles(response.data)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user files:', error);
  //     }
  //   };


  //   fetchUserFiles();
  // }, [user]);


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
                <th colSpan={4} className="py-2">
                  <div className="pl-10 py-5 bg-slate-100 text-start space-x-4 mt-14 mb-2">
                    <span className="font-semibold text-xl">File History</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={4} className="py-2">
                  <div className="ml-10 text-start space-x-4 mb-5">
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
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {fileDetails?.map((file, index) => (

                <tr key={index}>
                  <td className="px-5 py-5 pl-10 border-b border-gray-200 bg-white text-sm">
                    <a href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}> <span>{file.fileName}</span></a>
                    <button
                      onClick={() => {/* Implement share functionality */ }}
                      className="ml-2 hover:text-blue-500"
                    >
                      <ShareIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.fileSizeInBytes}</td>
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.createdAt}</td> */}
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.uploadedBy}</td> */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">success</td>

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
