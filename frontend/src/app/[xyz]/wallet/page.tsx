"use client";
import loading from "@/app/loading";
import Header from "@/components/Header";
import MetaMask from "@/components/MetaMask";
import { useValidation } from "@/components/Validation";
import { useEffect, useState } from "react";

export default function Home({ params }) {
  const [isScrolled, setIsScrolled] = useState(false);

  const isLoading = useValidation(params.xyz)
  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Check if the user has scrolled down a certain amount (e.g., 100 pixels)
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
 
   if(isLoading){
   return loading
   }

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


}
