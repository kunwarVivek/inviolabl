"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import { signOut, useSession } from "next-auth/react";
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected';

// alchemyConfig.js
const Header = () => {


  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
 const {data:session,status} = useSession()

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

if(status=="authenticated"){
  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } `}
              >
                 <div className="text-black dark:text-white text-2xl font-bold">RajKumar</div>
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>

              </div>
              
              <div className="flex items-center justify-end pr-16 lg:pr-0">
              
                {session&&<button
                  onClick={() => signOut({ callbackUrl: '/signin' })}
                  className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                >
                  Sign Out
                </button>}

               
    
      <div>
   

                <div>
                  <ThemeToggler />
                </div>
                
              </div>
              {isConnected?<span className="p-3 bg-red-700 text-white"> Connected to {ensName?? address}</span>:
       session&&<button className="p-3 bg-red-700 text-white" onClick={() => connect()}>Connect Wallet</button>}
            </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );}
};

export default Header;
