'use client'

import React, { useState } from "react"
import lighthouse from "@lighthouse-web3/sdk"
import { useWallets } from "@privy-io/react-auth";

function App() {
    const [file, setFile] = useState(null)

    // Define your API Key (should be replaced with secure environment variables in production)
    const apiKey = 'd257291d.f1c891385d364961a1be2577212e7eed'

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - ((progressData?.total || 0) / (progressData?.uploaded || 1)) * 100;
        console.log(percentageDone);
    };

    const { wallets } = useWallets();


    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
    

    const signAuthMessage = async () => {
        if (window.ethereum) {
            try {
                const eip1193provider = await embeddedWallet.getEthereumProvider();
                const signerAddress = embeddedWallet.address
                const { message } = (await lighthouse.getAuthMessage(embeddedWallet.address)).data
                const signature = await eip1193provider.request({
                    method: "personal_sign",
                    params: [message, embeddedWallet.address],
                })
                return { signature, signerAddress }
            } catch (error) {
                console.error("Error signing message with Wallet", error)
                return null
            }
        } else {
            console.log("Please install Wallet!")
            return null
        }
    }

    // Function to upload the encrypted file
    const uploadEncryptedFile = async () => {
        if (!file) {
            console.error("No file selected.")
            return
        }

        try {
            // This signature is used for authentication with encryption nodes
            // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
            const encryptionAuth = await signAuthMessage()
            if (!encryptionAuth) {
                console.error("Failed to sign the message.")
                return
            }

            const { signature, signerAddress } = encryptionAuth

            // Upload file with encryption
            const output = await lighthouse.uploadEncrypted(
                file,
                apiKey,
                signerAddress,
                signature,
                progressCallback
            )
            console.log("Encrypted File Status:", output)
            /* Sample Response
              {
                data: [
                  Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
                  Name: "izanami.jpeg",
                  Size: "174111"
                ]
              }
            */
            // If successful, log the URL for accessing the file
            console.log(
                `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
            )
        } catch (error) {
            console.error("Error uploading encrypted file:", error)
        }
    }

    // Function to handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    return (
        <div className="App">
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadEncryptedFile} disabled={!file}>
                Upload Encrypted File
            </button>
        </div>
    )
}

export default App