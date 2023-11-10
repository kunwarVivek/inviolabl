'use client'
import React from 'react'
import ConnectWallet from './ConnectWallet'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const { data: session, status } = useSession();
  return (
    <nav className="text-black bg-gray-300 py-3 mx-auto ">
    <div className="max-w-7xl  container mx-auto flex justify-between items-center px-6 ">
      <div className="flex items-center space-x-4">
       <Link href={"/"}> <div className="text-2xl font-bold">Logo</div></Link>
      </div>
      <div className="flex items-center space-x-4">
        
        {session&&<button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-400 ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-md bg-primary px-8 py-2 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                >
                  Sign Out
                </button>}
                <ConnectWallet/>
                <>
                <Link href={"/profile"}>
              <Image
                src={"/metamask-icon.svg"} // Replace with your image path
                alt="Profile"
                height={10}
                width={10}
                className="h-10 w-10 rounded-full border-2 border-gray-300"
              />
              </Link>
              </>
      </div>
    </div>
  </nav>
  )
}

export default Header