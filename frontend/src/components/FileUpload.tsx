"use client";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import lighthouse from "@lighthouse-web3/sdk";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ethers } from "ethers";
import Upload from "../artifacts/contracts/Upload.sol/Upload.json"




const FileUpload = ({ isModalOpen, setIsModalOpen }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxTotalSize = 500 * 1024 * 1024; // 500MB in bytes
  const router = useRouter()
  const { userId, sessionId, getToken } = useAuth();

  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );

  const [fileName, setFileName] = useState("No File selected");
  const lightapi = "609989b0.b85f2616ce1a490eb457e1fd4d7bc994";
  const [loading, setLoading] = useState(false)


  const progressCallback = (progressData) => {
    let percentageDone =
      100 - ((progressData?.total || 0) / (progressData?.uploaded || 1)) * 100;
    console.log(percentageDone);
  };


  const uploadFile = async (file) => {
    setFileName(file[0].name)
    setLoading(true);
    try {
      const output = await lighthouse.upload(
        file,
        lightapi,
        false,
        null,
        progressCallback
      );
      console.log("File Status:", output);
      console.log(
        "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
      );
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      let contractAddress = "0xA2C019a3DC84801B575C2a24c16D2820469C9F3d";

      const contract = new ethers.Contract(
        contractAddress,
        Upload.abi,
        signer
      );
      contract.add(MetaMaskAccount, `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`);
      alert("Successfully Image Uploaded");
      return output.data.Hash;
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setFileName("No File selected") // Set loading back to false when uploading is complete
    }
  };


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
                        disabled={!MetaMaskAccount}
                        type="file"
                        className="hidden"
                        id="file-upload"
                        name="data"
                        onChange={(e) => {
                          uploadFile(e.target.files);
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
