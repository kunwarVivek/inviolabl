"use client";
import Header from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {

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
                        <img className="w-[57%]" src="nft.png" alt="" />
                    </div>
                </div>
                <div className="">
                    <form className="w-full">
                        <div className="flex items-center border-b border-gray-500 py-2 mb-14">
                            <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none" type="text" placeholder="Name" aria-label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="flex items-center border-b border-gray-500 py-2 mb-14">
                            <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none" type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex items-center border-b border-gray-500 py-2 mb-14">
                            <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none" type="text" placeholder="Organization name" aria-label="Organization name" value={organizationName}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    // Remove symbols using a regular expression
                                    const cleanedInput = input.replace(/[^a-zA-Z0-9\s]/g, '');
                                    setOrganizationName(cleanedInput);
                                }} />
                            {organizationName && (
                                <span className="px-2 font-medium text-sm">
                                    {organizationName}.inviolabl.com
                                </span>
                            )}
                        </div>
                        <div className="flex items-center border-b border-gray-500 py-2 mb-14">
                            <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none" type="text" placeholder="Phone Number" aria-label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="mb-14 text-center text-sm">
                            <span>By clicking on Start Now, you accept our <span className="text-purple-700 cursor-pointer">Subscription Agreement</span> and <span className="text-purple-700 cursor-pointer">Privacy Policy</span></span>
                        </div>
                        <div className="pb-7 flex justify-end">
                            <button
                                onClick={(e) => submit(e)}
                                className="py-2 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold">
                                <span>Start Now</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="ms-2 fill-white" height="1em" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}
