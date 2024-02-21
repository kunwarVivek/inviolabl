import {
  AccountKitNftMinterAbi,
  nftContractAddress,
} from "@/config/token-contract";
import { useWalletContext } from "../../context/wallet";
import { useInterval } from "../../hooks/useInterval";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Transaction, encodeFunctionData } from "viem";
import accountKitCircle from "../../../public/assets/account-kit-circle.svg";
import accountKitText from "../../../public/assets/account-kit-text.svg";
import { BANNER_STATES } from "../utils/Banner";
import Upload from "../../artifacts/contracts/Upload.sol/Upload.json"
import Dashboard from "../Dashboard";
import { Dialog, Transition } from "@headlessui/react";
import DropdownMenu from "../DropdownMenu";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import lighthouse from "@lighthouse-web3/sdk";
import { toast } from "react-toastify";
import { Alchemy, Network } from "alchemy-sdk";



export default function NftHome({
  setHasMinted,
  isMinting,
  setIsMinting,
  setBannerState,
  setUserOpHash,
  setTxHash,
  userOpHash,
  txHash,
  setError,
}: any) {
  const { login, isLoggedIn, provider } = useWalletContext();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  useInterval(async () => {
    if (isMinting && !txHash && userOpHash && provider) {
      const receipt = await provider
        .getUserOperationReceipt(userOpHash as `0x${string}`)
        .catch(() => null);
      if (receipt) {
        const txHash = await provider
          .getTransaction(receipt.receipt.transactionHash)
          .then((x: any) => (x as Transaction).hash);

        setTxHash(txHash);
        setBannerState(BANNER_STATES.TX_HASH);

        await provider.rpcClient.waitForTransactionReceipt({
          hash: txHash,
        });

        setIsMinting(false);
        handleScroll("wallet");
        setHasMinted(true);
        setUserOpHash(undefined);
        setBannerState(BANNER_STATES.MINT_SUCCESS);

        setTimeout(() => {
          setBannerState(BANNER_STATES.NONE);
        }, 10000);
      }
    }
  }, 3000);

  const [add,setAdd] = useState('')

  const handleMint = useCallback(async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    setHasMinted(false);
    setTxHash(undefined);
    setIsMinting(true);
    setBannerState(BANNER_STATES.MINT_STARTED);

    try {
      const uoHash = await provider.sendUserOperation({
        target: nftContractAddress,
        data: encodeFunctionData({
          abi: AccountKitNftMinterAbi,
          functionName: "mint",
          args: [await provider.getAddress()],
        }),
      });
      setAdd(await provider.getAddress())

      setUserOpHash(uoHash.hash);
      setBannerState(BANNER_STATES.USER_OP_HASH);
    } catch (e: any) {
      setError(e.details || e.message);
      setBannerState(BANNER_STATES.ERROR);
      setIsMinting(false);
    }
  }, [
    provider,
    setBannerState,
    setError,
    setHasMinted,
    setIsMinting,
    setTxHash,
    setUserOpHash,
  ]);
console.log(add)
  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openModal = useCallback(() => {
    setIsLoggingIn(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsLoggingIn(false);
  }, []);

  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setEmail(e.target.value);
    },
    []
  );

  const handleLogin = useCallback(
    async (event: any) => {
      event.preventDefault();
      await login(email);
      setIsLoggingIn(false);
      setEmail(email);
      closeModal();
    },
    [login, email, closeModal]
  );

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
        const response = await lighthouse.getUploads('d257291d.f1c891385d364961a1be2577212e7eed')
        console.log(response)
        setFileDetails(response.data.fileList)

      } catch (error) {
        console.error(`Error retrieving file details: ${error.message}`);
      }
    };

    fetchFileDetails();
  }, [triggerEffect, triggerDownload]);


  console.log(fileDetails)

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

  const [nfts, setNfts] = useState(undefined)

  const config = {
    apiKey: process.env.ALCHEMY_RPC_URL,
    network: Network.MATIC_MUMBAI,
  };
  const alchemy = new Alchemy(config);
  
  // const main = async () => {
  //   const nftss = await alchemy.nft.getNftsForOwner('0xFe83B1517a5A4f189D4B5a33446C44b7810DEDa2');
  //   console.log(nftss);
  //   setNfts(nftss.ownedNfts);
  // };

  // console.log(nfts)
  
  // const runMain = async () => {
  //   try {
  //     await main();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  // runMain();


  return (
    <div className="bg-white min-h-screen">

    <Dashboard>
      <Transition appear show={isLoggingIn} as={Fragment}>
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

                      <form className="text-black flex flex-col items-center justify-center rounded-lg w-full" onSubmit={handleLogin}>
                        <input
                          placeholder="Email"
                          onChange={onEmailChange}
                          className="input border border-solid border-gray-400 w-full"
                        />

                        <div className="flex flex-row justify-end max-md:flex-col flex-wrap gap-[12px] mt-5">
                          <button
                            type="button"
                            onClick={closeModal}
                            className="btn bg-gradient-2transition ease-in-out duration-500 transform hover:scale-110"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary text-black bg-gradient-1transition ease-in-out duration-500 transform hover:scale-110"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition >
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
            {nfts?.map((file, index) => (


              <tr key={index}>
                <td className="px-5 py-5 pl-10 border-b flex border-gray-200 bg-white text-sm">
                  <button

                    onClick={() => handleFileClick(file, index, account)}
                  >
                    <span>{file.contract.name}</span>
                  </button>

                  <a download={true} href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`} className="ml-2 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                      <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                    </svg>
                  </a>

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
      <div>
        <div className="relative mb-[-48px] md:mb-0 flex flex-col md:flex-row gap-10 md:gap-20 mx-6 md:mx-20 mt-12">
          <div className="flex flex-col items-center gap-y-5 lg:mt-16 mb-24 lg:mb-0">
            <div
              className="relative inline-flex group float-on-hover"
              onClick={() => (isLoggedIn ? handleMint() : openModal())}
            >
              <div className="absolute z-[-1] transition-all duration-1000 opacity-20 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <button className="flex items-center text-3xl px-16 py-4 lg:px-28 lg:py-6 rounded-lg text-white bg-custom-gradient">
                <span
                  className={`${isMinting ? "loading loading-spinner mr-4" : "hidden"
                    }`}
                ></span>
                {isMinting ? (
                  <div className="font-mono font-bold">Minting</div>
                ) : isLoggedIn ? (
                  <div className="font-mono font-bold">Mint</div>
                ) : (
                  <div className="font-sans font-bold whitespace-nowrap md:whitespace-normal">
                    Login
                  </div>
                )}
              </button>
            </div>
            <div
              className="text-left lg:mt-8"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
    </div>
  );
}

