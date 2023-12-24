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




const page = ({ params }) => {
  const [fileDetails, setFileDetails] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('')
  const [walletData, setWalletData] = useState()


  const userDetails = useSelector(
    (state: RootState) => state.user.details
  );

  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );

  console.log(MetaMaskAccount)

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xA2C019a3DC84801B575C2a24c16D2820469C9F3d";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );

        const wallRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wallet/all-wallets`)

        setWalletData(wallRes.data.wallets)

        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  console.log(fileDetails)


  const getdata = async (e) => {
    e.preventDefault();
    let dataArray;
    const wallets = walletData ?? [];


    const matchedWallet = wallets.find(wallet => wallet.email === emailAddress);
    console.log(matchedWallet.address)
    try {
      if (emailAddress) {
        dataArray = await contract.display(matchedWallet.address);
        console.log(dataArray);
      } else {
        setFileDetails(null)
      }
    } catch (e) {
      alert("You don't have access");
    }

    const isEmpty = (dataArray?.length || 0) === 0;

    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      console.log(str_array)

      const getCIDFromUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      };

      const lighthouseUrls = str_array.filter(url => url.includes('lighthouse.storage'));
      const cids = lighthouseUrls.map(getCIDFromUrl);

      const fileInfoArray = [];

      const fileInfo = async (cid) => {
        try {
          const fileInfoResult = await lighthouse.getFileInfo(cid);
          fileInfoArray.push(fileInfoResult.data);
        } catch (error) {
          console.error(`Error retrieving file info for CID ${cid}: ${error.message}`);
        }
      };

      const retrieveFileInfoForCids = async () => {
        for (const cid of cids) {
          await fileInfo(cid);
        }

        // Now, fileInfoArray contains an array of file details for each CID
        console.log(fileInfoArray);
        setFileDetails(fileInfoArray);
      };

      // Call the function to retrieve file details for each CID
      retrieveFileInfoForCids();
    } else {
      alert("No Files to display");
      setFileDetails(null)
    }
  };

  const { user } = useUser(); // Assuming you have a way to get the user ID

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

  const handleInputChange = (e) => {
    setEmailAddress(e.target.value);
  };

  return (

    <div className="bg-white min-h-screen">
      <Dashboard>
        <div className="mt-20 mx-10 mb-5">
          <form onSubmit={getdata}>
            <div className='flex items-center border-b border-gray-500 py-2 mb-5  px-2'>
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Email address"
                value={emailAddress}
                onChange={handleInputChange}
              />
            </div>
            <button className="py-2 mt-5 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold" type="submit">
              Get Data
            </button>
          </form>
        </div>
        <div className="overflow-x-auto min-h-screen bg-white rounded-md border shadow-2xl">
          <table className="min-w-full bg-white ">
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
