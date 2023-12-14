'use client'

import Dashboard from "@/components/Dashboard";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Upload from "../../../../artifacts/contracts/Upload.sol/Upload.json";


const Modal = () => {
    const [addressValue, setAddressValue] = useState(""); 
    const [contract, setcontract] = useState(null)

    const sharing = async () => {
        await contract.allow(addressValue);
    };

    useEffect(() => {
        const accessList = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            let contractAddress = "0xA2C019a3DC84801B575C2a24c16D2820469C9F3d";

            const contract = new ethers.Contract(
                contractAddress,
                Upload.abi,
                signer
            );
            const addressList = await contract.shareAccess();
            let select = document.querySelector("#selectNumber");
            const options = addressList;

            for (let i = 0; i < options.length; i++) {
                let opt = options[i];
                let e1 = document.createElement("option");
                e1.textContent = opt;
                e1.value = opt;
                e1.className = "address";
                select.appendChild(e1);
            }
        };

        contract && accessList();
    }, [contract]);

    return (
        <>
            <Dashboard>

                <div className="mt-20 mx-10">
                    <div className="title">Share with</div>
                    <div className='flex items-center border-b border-gray-500 py-2 mb-5 mt-5 px-2'>
                        <input
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                            type="text"
                            placeholder="Email address"
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                        />
                    </div>
                    <div className="p-0 mt-2">
                        <form id="myForm">
                            <select id="selectNumber">
                                <option className="address">People With Access</option>
                            </select>
                        </form>
                    </div>
                    
                </div>

            </Dashboard>
        </>
    );
};

export default Modal;
