"use client"

import Upload from "../../../../artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "../../../../components/FileUpload1";
import Display from "../../../../components/Display";
import Modal from "../../../../components/Modal";
import "../../../../components/App.css";

function App() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

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
                //console.log(contract);
                setContract(contract);
                setProvider(provider);
            } else {
                console.error("Metamask is not installed");
            }
        };
        provider && loadProvider();
    }, []);
    return (
        <>
            {!modalOpen && (
                <button className=" ml-10 mt-5 py-2 flex justify-center text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold" onClick={() => setModalOpen(true)}>
                    Allow access
                </button>
            )}
            {modalOpen && (
                <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
            )}

            <div className="App">
                <h1 className="text-black font-semibold">Files</h1>

                <p className="text-black account_add text-base font-semibold">
                    Account : {account ? account : "Not connected"}
                </p>
                <FileUpload
                    account={account}
                    provider={provider}
                    contract={contract}
                ></FileUpload>
                <Display contract={contract} account={account}></Display>
            </div>
        </>
    );
}

export default App;
