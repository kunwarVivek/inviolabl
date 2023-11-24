'use client'
import Header from '@/components/Header';
import MetaMask from '@/components/MetaMask';
import { useState, useEffect } from "react";

const DynamicRoutePage = ({ params }) => {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };


        window.addEventListener("scroll", handleScroll);


        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <div className="bg-white min-h-screen">
            <Header
                className={`text-white ${isScrolled && "bg-[#403f83] border-b border-cyan-900"
                    }`}
            />
            <div className="wallet_background h-72 flex justify-center items-center mb-10">
                <h1 className="text-5xl text-white font-bold">Wallet</h1>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="flex">
                    <MetaMask />
                </div>
            </div>
        </div>
    );
};

export default DynamicRoutePage;


