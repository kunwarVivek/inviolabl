"use client";
import Dashboard from "@/components/Dashboard";
import { RootState } from "@/store/store";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { WalletClientSigner } from "@alchemy/aa-core";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import lighthouse from "@lighthouse-web3/sdk";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
// import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { setFileUploadComplete } from "@/features/FileUploadCompleteSlice";
import MagicBellClient, { Notification } from "@magicbell/core";
import { useRouter } from "next/navigation";


const page = () => {
  MagicBellClient.configure({ apiKey: '644b158683d2a357dc593625a99be3edc344a6fe', apiSecret: '8zQx0ykxUj89n9A7G6CmY5U+lcsjqNsqe7e/3VE0' });
  const [fileDetails, setFileDetails] = useState(null);
  const [account, setAccount] = useState("");
  const [data, setData] = useState();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const dispatch = useDispatch();

  console.log(data);

  const { signMessage } = usePrivy();
  const { userId, sessionId, getToken } = useAuth();

  const { organization: currentOrganization } = useOrganization();

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      router.replace(
        `https://alpha.inviolabl.io/organization/${currentOrganization?.name}/dashboard`
      );
    };
    handleScroll();
  }, [currentOrganization]);

  const PrivyAccount = useSelector((state: RootState) => state.privy.account);

  console.log(PrivyAccount);

  const userDetails = useSelector((state: RootState) => state.user.details);

  const fileUploadComplete = useSelector(
    (state: RootState) => state.FileUploadComplete.account
  );

  console.log(userDetails?.primaryEmailAddress?.emailAddress);

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  console.log(embeddedWallet?.address);

  const [email, setEmail] = useState([]);
  const [cid, setCid] = useState([]);

  const [privyUsers, setPrivyUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [accessData, setAccessData] = useState([]);
  const [matchedAccessData, setMatchedAccessData] = useState([]);
  const [address, setAddress] = useState("");
  const [fileInfo, setFileInfo] = useState([]);

  const [countDetails, setCountDetails] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchFileDetails = async () => {
      dispatch(setFileUploadComplete(false));
      setDownloading(false);
      setViewing(false);
      try {
        const token = await getToken()
        setToken(token)
        const response = await lighthouse.getUploads('87ea616b.7316eb2b3fad435f9e5618aca682acb8')
        console.log(response)
        setFileDetails(response.data.fileList)

        const countDet = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/counts`
        );
        setCountDetails(countDet.data);

        const cids = response.data.fileList.map((file) => file.cid);
        const accessPromises = cids.map((cid) =>
          lighthouse.getAccessConditions(cid)
        );
        const accessResponses = await Promise.all(accessPromises);
        const accessData = accessResponses.map((response) => response.data);
        setAccessData(accessData);

        const matchedAccess = accessData.filter((access) => {
          return (
            access.owner == Number(PrivyAccount) ||
            access.sharedTo.some((account) => account == Number(PrivyAccount))
          );
        });
        console.log("Matched Access Data:", matchedAccess);
        setMatchedAccessData(matchedAccess);

        const fileInfos = await Promise.all(
          matchedAccess.map((access) => lighthouse.getFileInfo(access.cid))
        );
        const fileInfoList = fileInfos.map((response) => response.data);
        console.log("File Info:", fileInfoList);
        setFileInfo(fileInfoList);

        const privyUsersList = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/privy/users`
        );
        setPrivyUsers(privyUsersList.data.privyUsers);
      } catch (error) {
        console.error(`Error retrieving file details: ${error.message}`);
      }
    };

    fetchFileDetails();
  }, [downloading, viewing, fileUploadComplete]);

  console.log(token);
  console.log(email);
  console.log(cid);
  console.log(accessData);
  console.log(countDetails);

  console.log(matchedAccessData);
  console.log(fileInfo);

  const [pdfOpened, setPdfOpened] = useState(false);

  const handleFileClick = async (cid, type) => {
    try {
      const { publicKey, signedMessage } = await encryptionSignature();

      const keyObject = await lighthouse.fetchEncryptionKey(
        cid,
        publicKey,
        signedMessage
      );

      const decrypted = await lighthouse.decryptFile(
        cid,
        keyObject.data.key,
        type
      );
      console.log(decrypted);

      const url = URL.createObjectURL(decrypted);
      console.log(url);
      setFileURL(url);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/counts/${cid}/views/increment`
      );

      // Open the URL in a new window
      window.open(url);

      // Set viewing to true after opening the window
      setViewing(true);
    } catch (error) {
      console.error("Error calling addview function:", error);
      return;
    } finally {
      setLoading(false);
      setTriggerEffect(true);
    }
  };

  const handleFileDownload = async (file, index, account) => {
    try {
      const transaction = await contract.addDownload(account, index);
      toast.info("Processing transaction...", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: false,
      });
      await transaction.wait();
      console.log("addDownload function called successfully");
      toast.dismiss();

      toast.success("transaction successfull", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error calling addDownload function:", error);
      return;
    }

    fetch(file.fileName).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);

        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = file.fileName;
        alink.click();
      });
    });
    setTriggerDownload(true);
  };

  console.log(userDetails);

  // const { user } = useUser();

  const [userFiles, setUserFiles] = useState([]);
  console.log(userFiles);

  const [filter, setFilter] = useState("all");
  const [fileHistory, setFileHistory] = useState([
    // { filename: "resume.pdf", size: "1mb", createdAt: "yesterday", status: "Success" },
  ]);
  console.log(filter);

  const filteredFileHistory =
    filter === "all"
      ? fileHistory
      : fileHistory.filter(
          (file) =>
            file &&
            file.filename &&
            file.filename.endsWith(`.${filter.toLowerCase()}`)
        );

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
      <button onClick={exportWallet} disabled={!isAuthenticated}>
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

  const uiConfig = {
    title: "Sign",
    description: "Signature",
    buttonText: "Confirm",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileURL] = useState("");

  const addresses = embeddedWallet?.address;

  const encryptionSignature = async () => {
    const eip1193provider = await embeddedWallet?.getEthereumProvider();
    const messageRequested = (await lighthouse.getAuthMessage(addresses)).data
      .message;
    const signedMessage = await signMessage(messageRequested, uiConfig);
    return {
      signedMessage: signedMessage,
      publicKey: addresses,
    };
  };

  const decrypt = async () => {
    // Fetch file encryption key
    const cid = "QmRJS5VC6qTvuvu47VNuQjKuEZnnPyT3NFRpj9NU6GR7Wf"; //replace with your IPFS CID
    const { publicKey, signedMessage } = await encryptionSignature();
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    // Decrypt file
    /*
      decryptFile(cid, key, mimeType)
        Parameters:
          CID: CID of the file to decrypt
          key: the key to decrypt the file
          mimeType: default null, mime type of file
    */
    const fileType = "application/pdf";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    /*
      Response: blob
    */

    // View File
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
  };

  const downloadFile = async (cid, path, type) => {
    const eip1193provider = await embeddedWallet?.getEthereumProvider();
    const organizationPolicy = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations/name/${currentOrganization.id}`
    );
    const privyClient = createWalletClient({
      account: embeddedWallet?.address as `0x${string}`,
      chain: sepolia,
      transport: custom(eip1193provider),
    });

    const privySigner = new WalletClientSigner(privyClient, "json-rpc");

    const provider = new AlchemyProvider({
      apiKey: "7u3nZd8ofdYF4IYygF_7LzrA3MDw8rIs",
      chain: sepolia,
      entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    })
      .connect(
        (rpcClient) =>
          new LightSmartContractAccount({
            entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
            chain: rpcClient.chain,
            owner: privySigner,
            factoryAddress: getDefaultLightAccountFactoryAddress(
              rpcClient.chain
            ),
            rpcClient,
          })
      )
      .withAlchemyGasManager({
        policyId: organizationPolicy.data.gasPolicy,
      });

    try {
      const lighthouseDealDownloadEndpoint =
        "https://gateway.lighthouse.storage/ipfs/";
      const { publicKey, signedMessage } = await encryptionSignature();

      const keyObject = await lighthouse.fetchEncryptionKey(
        cid,
        publicKey,
        signedMessage
      );

      const decrypted = await lighthouse.decryptFile(
        cid,
        keyObject.data.key,
        type
      );
      console.log(decrypted);

      const url = URL.createObjectURL(decrypted);
      console.log(url);
      setFileURL(url);

      const toastId = toast.info(
        "Preparing to download... Transaction is in process",
        { autoClose: false }
      );

      const tx = await provider.sendTransaction({
        from: embeddedWallet.address as `0x${string}`,
        to: "0x0ae88c1852E683b9907E69b7a4F96d09B3A35b84",
      });

      console.log(tx);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/counts/${cid}/downloads/increment`
      );

      toast.dismiss(toastId);
      const not = Notification.create({
        title: "File downloaded.",
        content: `File download success.`,
        recipients: [{ email: userDetails?.primaryEmailAddress?.emailAddress }],
      });

      try {
        const downloadResponse = await axios({
          method: "GET",
          url: `${lighthouseDealDownloadEndpoint}${cid}`,
          responseType: "arraybuffer",
        });

        const blob = new Blob([downloadResponse.data], {
          type: downloadResponse.headers["content-type"],
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(decrypted);
        link.download = path.split("/").pop();
        link.click();

        console.log("File downloaded successfully.");
        setDownloading(true);
      } catch (error) {
        console.error("Error downloading file:", error.message);
        throw new Error("download Error");
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw new Error("download Error");
    }
  };

  console.log(selectedEmail);

  const shareFile = async (cidHash: any) => {
    try {
      const cid = cidHash;
      const publicKey = embeddedWallet.address;
      const messageRequested = (
        await lighthouse.getAuthMessage(embeddedWallet.address)
      ).data.message;
      const signedMessage = await signMessage(messageRequested, uiConfig);
      const user = privyUsers.find(
        (user) => user?.custom?.customUserId == selectedEmail
      );
      console.log(user);

      const publicKeyUserB = [user.wallet.address];
      console.log(publicKeyUserB);

      const shareResponse = await lighthouse.shareFile(
        publicKey,
        publicKeyUserB,
        cid,
        signedMessage
      );

      console.log(shareResponse);
      setIsModalOpen(false);
      toast.info(`FIle access shared to ${selectedEmail}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      const not = Notification.create({
        title: "File Access Granted.",
        content: `You can now view shared files under dashboard `,
        recipients: [{ email: selectedEmail }],
      });
    } catch (error) {
      console.log(error);
      throw new Error("Share file");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail("");
    setValidUser(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const [cidHash, setCidHash] = useState("");

  const getUploadedBy = (cid) => {
    const detail = countDetails.find(detail=>detail.cid === cid);
    return detail ? detail.email : userDetails?.primaryEmailAddress?.emailAddress;
  }

  const getDownloadCount = (cid) => {
    const detail = countDetails.find((detail) => detail.cid === cid);
    return detail ? detail.downloads : 0;
  };

  const getViewCount = (cid) => {
    const detail = countDetails.find((detail) => detail.cid === cid);
    return detail ? detail.views : 0;
  };

  console.log(fileUploadComplete);

  const [validUser, setValidUser] = useState(true);

  const validateSelectedEmail = () => {
    const isValidUser = privyUsers.some(
      (user) => user?.custom?.customUserId === selectedEmail
    );
    setValidUser(isValidUser);
  };

  return (
    <div className="bg-white min-h-screen">
      <Dashboard>
        <div className="overflow-x-auto min-h-screen bg-white rounded-md border shadow-2xl">
          <table className="min-w-full bg-white ">
            <thead className="bg-white text-black ">
              <tr>
                <th colSpan={6} className="py-2">
                  <div className="pl-10 py-5 bg-slate-100 text-start space-x-4 mt-14 mb-2">
                    <span className="font-semibold text-xl">File History</span>
                  </div>
                </th>
              </tr>
              {/* <tr>
                <th colSpan={5} className="py-2">
                  <div className="mr-10 flex justify-end text-start space-x-4 mb-5">
                    <DropdownMenu
                      buttonText="Type"
                      options={typeOptions}
                      onSelect={handleFilterChange}
                    />
                    <DropdownMenu
                      buttonText="Modified"
                      options={modifiedOptions}
                      onSelect={handleFilterChange}
                    />
                  </div>
                </th>
              </tr> */}
            </thead>
            {/* <ExportWalletButton /> */}

            <thead>
              <tr>
                <th className="px-5 pl-10 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  FILE NAME
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  SIZE
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  UPLOADED BY
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  NO OF VIEWS
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {fileInfo?.map((file, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 pl-10 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleFileClick(file.cid, file.mimeType)}
                    >
                      <span>{file.fileName}</span>
                    </button>

                    <button
                      onClick={() => downloadFile(file.cid, "/", file.mimeType)}
                      className="ml-2 hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 512 512"
                      >
                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                      </svg>
                    </button>



                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.fileSizeInBytes}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getUploadedBy(file.cid)}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getViewCount(file.cid)}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getDownloadCount(file.cid)}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"> <button onClick={() => { openModal(); setCidHash(file.cid) }} className="py-2 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold">
                    Share
                  </button></td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                        <div className="flex items-center border-b border-gray-500  mb-5 mt-5 ">
                          <input
                            type="text"
                            className="appearance-none bg-transparent p-2 border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                            value={selectedEmail}
                            onChange={(e) => {
                              setSelectedEmail(e.target.value);
                              setValidUser(true);
                            }}
                            onBlur={validateSelectedEmail}
                            list="emailList"
                            placeholder="Enter email address"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {selectedEmail?.length > 0 && (
                            <datalist id="emailList">
                              {privyUsers.map((user) => (
                                <option
                                  key={user?.id}
                                  value={user?.custom?.customUserId}
                                />
                              ))}
                            </datalist>
                          )}
                        </div>
                        {!validUser && (
                          <span className="text-red-500 text-sm font-semibold">
                            Please choose an email address from the list.
                          </span>
                        )}
                        <button
                          disabled={!selectedEmail || !validUser}
                          onClick={() => shareFile(cidHash)}
                          className="py-2 mt-5 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold"
                        >
                          <span>Share</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ms-2 fill-white"
                            height="1em"
                            viewBox="0 0 320 512"
                          >
                            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Dashboard>
    </div>
  );
};

export default page;
