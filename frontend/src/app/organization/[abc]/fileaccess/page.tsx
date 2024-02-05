'use client'

import Dashboard from "@/components/Dashboard";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Upload from "../../../../artifacts/contracts/Upload.sol/Upload.json";
import MemberList from "@/components/MemberList";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import axios from "axios";
import MagicBellClient, { Notification } from '@magicbell/core';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";



const Modal = () => {

    MagicBellClient.configure({ apiKey: '644b158683d2a357dc593625a99be3edc344a6fe', apiSecret: '8zQx0ykxUj89n9A7G6CmY5U+lcsjqNsqe7e/3VE0' });

    const [addressValue, setAddressValue] = useState("");
    const [contract, setcontract] = useState(null);
    const [walletData, setWalletData] = useState();
    const [clerkUsers, setClerkUsers] = useState([]);

    const { ready, authenticated, user, logout } = usePrivy();
    const { sendTransaction } = usePrivy();

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

    const { wallets } = useWallets();
    const wallet = wallets?.find((wallet) => (wallet.address === '0x0D8Be9Cbb3FD97cbABF21Ba9524418eA651D9Ed4'));
    // Inspect its chainId
    const chainId = wallet?.chainId;
    console.log(chainId);

    const sharing = async () => {
        const wallets = walletData ?? [];


        const matchedWallet = wallets.find(wallet => wallet.email === addressValue);
        console.log(matchedWallet.address)
        if (matchedWallet) {
            try {
                // Call the 'allow' method with the matched wallet address
                await contract.allow(matchedWallet.address);
                console.log("Access granted successfully!");
                const not = Notification.create({
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

    // useEffect(() => {
    //     (async () => {
    //         const provider = new ethers.BrowserProvider(window.ethereum);
    //         await provider.send("eth_requestAccounts", []);
    //         const signer = await provider.getSigner();
    //         let contractAddress = "0x82074bFb2F39E93b93a6dD6071Bb725727A1B664";

    //         const newContract = new ethers.Contract(
    //             contractAddress,
    //             Upload.abi,
    //             signer
    //         );

    //         const wallRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wallet/all-wallets`)

    //         setWalletData(wallRes.data.wallets)

    //         setcontract(newContract);

    //         const addressList = await newContract.shareAccess();
    //         console.log(addressList)
    //         let select = document.querySelector("#selectNumber");
    //         const options = addressList;

    //         for (let i = 0; i < options.length; i++) {
    //             let opt = options[i];
    //             let e1 = document.createElement("option");
    //             e1.textContent = opt;
    //             e1.value = opt;
    //             e1.disabled = true
    //             e1.className = "address";
    //             select.appendChild(e1);
    //         }
    //     })();
    // }, []);

    useEffect(() => {
        
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clerk/users`)
            .then(response => {
                
                const emailAddresses = response.data.clerkUsers.map(user =>
                    user.emailAddresses[0]?.emailAddress || ''
                );

                
                setClerkUsers(emailAddresses);
            })
            .catch(error => {
                console.error('Error fetching Clerk users:', error);
            });
    }, []);

    const filteredEmails = clerkUsers.filter(
        email => email.toLowerCase().includes(addressValue.toLowerCase())
    );


    function SendTransactionButton() {

        
        const unsignedTx = {
            to: '0x82074bFb2F39E93b93a6dD6071Bb725727A1B664',
            chainId: 84532,
            value: '0x3B9ACA00',
            data: encodeFunctionData({
                abi: Upload.abi,
                functionName: 'uploadFile',
                args: [`https://gateway.lighthouse.storage/ipfs/`, "sm", "12", "test"]
              }),
        };

        
        const uiConfig = {
            header: 'Sample header text',
            description: 'Transaction',
            buttonText: 'Confirm'
        };

        
        return (
            <button disabled={!addressValue} onClick={async () => {
                const txReceipt = await sendTransaction(unsignedTx, uiConfig);
            }}>
                Share
            </button>);
    }

    return (
        <>
            <Dashboard>

                <div className="mt-20 mx-10">
                    <div className="title font-semibold">Share with</div>
                    <div className='flex items-center border-b border-gray-500  mb-5 mt-5 '>
                        <input
                            type="text"
                            className="appearance-none bg-transparent p-2 border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                            list="emailList"
                            placeholder="Enter email address"
                        />
                        {addressValue.length > 0 && (
                            <datalist id="emailList">
                                {filteredEmails.map((email, index) => (
                                    <option key={index} value={email} />
                                ))}
                            </datalist>
                        )}
                    </div>

                    <div className="p-0 mt-2">
                        <select id="selectNumber" className="w-full p-2 font-semibold text-sm">
                            <option className="address">People With Access</option>
                        </select>
                    </div>
                    <div className="footer">
                        <button className="py-2 mt-5 mb-5 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold"><SendTransactionButton /></button>
                        <span className="font-medium"><span className="font-semibold mr-2">Note:</span>Both the Admin and member should have their wallets connected, to use file access and share access.</span>
                    </div>

                </div>

            </Dashboard>
        </>
    );
};

export default Modal;
