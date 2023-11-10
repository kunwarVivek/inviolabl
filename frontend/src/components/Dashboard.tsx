'use client'

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { useState } from "react";
import FileUpload from "./FileUpload";
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

const Dashboard = ({children}) => {
    const pathname = usePathname();

    // This function checks if the path is the active route
    const isActive = (path) => {
      return pathname === path;
    };
    const [isModalOpen, setIsModalOpen] = useState(false);

return (
  <div className="flex flex-col h-screen bg-gray-100">
  {/* Header */}
  <header className="w-full">
      <Header />
  </header>

  {/* Sidebar and Content */}
  <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      
          <FileUpload isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="sidebar bg-slate-100 text-slate-950 text-md font-semibold w-64 space-y-3 py-4 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
          {/* Logo */}
          <Link href="/dashboard" className="text-white flex justify-center items-center space-x-2 px-4">
              <span className="text-xl font-semibold text-blue-600">Inov</span>
          </Link>

          {/* Navigation */}
          <nav>
          <button
              onClick={() => setIsModalOpen(true)}
              className="px-2 mb-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
          >
            <div className="flex items-center">
             <ArrowUpCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="text-sm">Upload Files</span>
              </div>
          </button>
              <Link href="/dashboard" className={`block py-2 mb-2 px-4 rounded transition duration-200 ${isActive('/dashboard') ? 'bg-gray-300 text-blue-600' : 'hover:bg-blue-700 hover:text-white'} `}>
                  Dashboard
              </Link>
              
          </nav>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
              <div className="container mx-auto px-6 py-8">
                  {children}
              </div>
          </main>
      </div>
  </div>
</div>
  );}

export default Dashboard;
