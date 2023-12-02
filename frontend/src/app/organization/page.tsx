"use client";
import Header from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth, useSessionList, useUser } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { updateUserFromResponse } from "@/features/LoginSlice";
import OrganizationList from "@/components/OrganizationList";
import CreateOrganization from "@/components/CreateOrganization";
import nftImg from "../../../public/nft.png"
import Image from "next/image";
import { useSession } from "next-auth/react";


export default function Home() {

    const { isLoaded, isSignedIn, user } = useUser();
    console.log(user?.primaryEmailAddress.emailAddress)

    const {  userId, sessionId, getToken } = useAuth();
    console.log(sessionId, userId, getToken)
    

    // const registerUser = async () => {
    //     try {
    //         // Make an HTTP POST request using Axios
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
    //             email: user?.primaryEmailAddress.emailAddress,
    //             password: "12345678",
    //         });

    //         // Handle the response, e.g., show a success message
    //         console.log('Registration successful:', response.data);
    //         dispatch(updateUserFromResponse(response.data));
    //     } catch (error) {
    //         // Handle errors, e.g., show an error message
    //         console.error('Registration failed:', error.message);
    //     }
    // };


    const [organizationName, setOrganizationName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const router = useRouter();

    const submit = (e) => {
        e.preventDefault();

        // Create new tenant
        const tenantData = {
            "name": name,
            "domain": `${organizationName}.inviolabl.com`,
            "email": email,
            "phone": phone
        };

        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants`, tenantData)
            .then(tenantResponse => {

                console.log(tenantResponse.data);

                const userData = {
                    "firstName": tenantResponse.data.name,
                    "lastName": "admin",
                    "email": tenantResponse.data.email,
                    "tenantId": tenantResponse.data.id,
                    "password": "12345678",
                    "role": "ADMIN"
                };

                return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`, userData);
            })
            .then(userResponse => {

                console.log(userResponse.data);
                setOrganizationName('');
                setName('');
                setEmail('');
                setPhone('');
                router.push(`/${userResponse.data.firstName}`);

                toast.success(`Hi ${name}, a tenant with the domain ${organizationName}.inviolabl.com has been created, and a user has been associated. You will receive an email notification.`, {
                    pauseOnHover: true,
                    theme: 'colored',
                    progressStyle: { background: 'rgb(216 180 254)' },
                    style: { background: 'rgb(126 34 206)' },
                });
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Error');
            });
    }


    return (
        <div>
            <Header
                className={`text-white bg-[#403f83]`}
            />

            <div
                className="mt-14 max-w-full px-8 grid gap-8 grid-cols-1 md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 py-16 mx-auto bg-gray-100 text-gray-900 rounded-lg shadow-lg">

                <div className="flex flex-col">
                    <div>
                        <h2 className="text-3xl text-[#8364E2] font-bold">Inviolabl | Get Started</h2>
                        <div className="text-gray-700 font-semibold text-lg mt-8">
                            Start with us Now!
                        </div>
                    </div>
                    <div className="flex mt-10 justify-center items-center text-center">
                        {/* <img className="w-[62.7%]" src={nftImg} alt="" /> */}
                        <Image src={nftImg} alt="NFT Image" className="w-[62.7%]" />
                    </div>
                </div>
                <div className="">
                    {/* <CreateOrganization routing="path" path="/organization" afterCreateOrganizationUrl=":slug" /> */}
                    <CreateOrganization />
                    <div className="mt-10">
                        <OrganizationList />
                    </div>
                </div>
            </div>
        </div>

    );
}
