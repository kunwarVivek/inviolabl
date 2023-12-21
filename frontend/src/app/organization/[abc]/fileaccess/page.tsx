'use client'

import Dashboard from "@/components/Dashboard";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Upload from "../../../../artifacts/contracts/Upload.sol/Upload.json";
import MemberList from "@/components/MemberList";
import { useOrganization } from "@clerk/nextjs";
import axios from "axios";
import MagicBellClient, { Notification } from '@magicbell/core';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";



const Modal = () => {

    MagicBellClient.configure({ apiKey: '644b158683d2a357dc593625a99be3edc344a6fe', apiSecret: '8zQx0ykxUj89n9A7G6CmY5U+lcsjqNsqe7e/3VE0' });

    const [addressValue, setAddressValue] = useState("");
    const [contract, setcontract] = useState(null);
    const [walletData, setWalletData] = useState();

    console.log(addressValue)

    console.log(walletData)

    const { membershipList, membership } = useOrganization({
        membershipList: {},
    });

    const userDetails = useSelector(
        (state: RootState) => state.user.details
      );
    
      console.log(userDetails)
    
      console.log(userDetails?.primaryEmailAddress.emailAddress)

    const sharing = async () => {
        const wallets = walletData ?? [];


        const matchedWallet = wallets.find(wallet => wallet.email === addressValue);
        console.log(matchedWallet.address)
        if (matchedWallet) {
            try {
                // Call the 'allow' method with the matched wallet address
                await contract.allow(matchedWallet.address);
                console.log("Access granted successfully!");
                const not=Notification.create({
                    title: 'File Access Granted.',
                    content: `You can now check files uploaded by ${userDetails.primaryEmailAddress.emailAddress} `,
                    recipients: [{ email: addressValue }],
                });
                console.log(not);

            } catch (error) {
                console.error("Error granting access:", error);
            }
        } else {
            console.warn("No wallet found for the provided email address.");
        }

    };

    console.log(contract)

    useEffect(() => {
        (async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            let contractAddress = "0xA2C019a3DC84801B575C2a24c16D2820469C9F3d";

            const newContract = new ethers.Contract(
                contractAddress,
                Upload.abi,
                signer
            );

            const wallRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wallet/all-wallets`)

            setWalletData(wallRes.data.wallets)

            setcontract(newContract);

            const addressList = await newContract.shareAccess();
            console.log(addressList)
            let select = document.querySelector("#selectNumber");
            const options = addressList;

            for (let i = 0; i < options.length; i++) {
                let opt = options[i];
                let e1 = document.createElement("option");
                e1.textContent = opt;
                e1.value = opt;
                e1.disabled = true
                e1.className = "address";
                select.appendChild(e1);
            }
        })();
    }, []);

    return (
        <>
            <Dashboard>

                <div className="mt-20 mx-10">
                    <div className="title font-semibold">Share with</div>
                    {/* <div className='flex items-center border-b border-gray-500 py-2 mb-5 mt-5 px-2'>
                        <input
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                            type="text"
                            placeholder="Email address"
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                        />
                    </div> */}
                    <div className='flex items-center border-b border-gray-500  mb-5 mt-5 '>
                        <select
                            className="appearance-none bg-transparent p-2 border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                        >
                            <option value="" disabled className="p-3">Select an option</option>

                            {membershipList
                                ?.filter(mem => mem.role !== "admin")
                                .map((mem, index) => (
                                    <option key={index} value={mem.publicUserData.identifier}>
                                        {mem.publicUserData.identifier}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="p-0 mt-2">
                        <select id="selectNumber" className="w-full p-2 font-semibold text-sm">
                            <option className="address">People With Access</option>
                        </select>
                    </div>
                    <div className="footer">
                        <button className="py-2 mt-5 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold" onClick={() => sharing()}>Share</button>
                    </div>

                </div>

            </Dashboard>
        </>
    );
};

export default Modal;
