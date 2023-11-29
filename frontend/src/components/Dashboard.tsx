"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { useState } from "react";
import FileUpload from "./FileUpload";
import {
  ArrowUpCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";

const Dashboard = ({ children },params) => {
  const pathname = usePathname();
  console.log(params.abc)
  const { data: session, status } = useSession();
  const tenantDetails = useSelector(
    (state: RootState) => state.tenant.details
  );
  const userDetails = useSelector(
    (state: RootState) => state.user.details
  );
  const isTenantIncluded = tenantDetails && pathname.includes(tenantDetails?.name);

  // This function checks if the path is the active route
  const isActive = (path) => {
    return pathname === path;
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Initially open
  const [transitionComplete, setTransitionComplete] = useState(true);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setTransitionComplete(false); // Reset transition state when toggling
  };

  // Handle the end of the sidebar transition
  const handleTransitionEnd = () => {
    if (isSidebarOpen) {
      setTransitionComplete(true);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}{" "}
      <FileUpload isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <header className="w-full">
        <Header className={isSidebarOpen ? "max-w-ful z-0 pl-[10.5rem] absolute" : "z-0 max-w-full absolute"} />
      </header>
      {/* Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`flex flex-col bg-slate-100 text-slate-950 space-y-3 py-4 px-2 absolute inset-y-0 left-0 transform transition-all duration-200 ease-linear ${isSidebarOpen ? "w-48" : "w-16"
            }`}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-0 right-5 p-2 transform translate-x-full"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="bg-black text-white rounded-full p-1 h-6 w-6" />
            ) : (
              <ChevronRightIcon className="bg-black text-white rounded-full p-1 h-6 w-6" />
            )}
          </button>

          {/* Navigation Links */}
          <nav className={`flex flex-col ${!isSidebarOpen && "items-center"} px-2 pt-10 gap-3`}>
            {/* Conditional rendering based on sidebar state */}
            {isSidebarOpen && transitionComplete && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 w-fit py-4 bg-white hover:bg-slate-200 text-black shadow-2xl rounded-xl hover:bg-opacity-90"
              >
                <div className={`flex items-center `}>
                  <ArrowUpCircleIcon
                    className="h-6 w-6 mr-2"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">Upload Files</span>
                </div>
              </button>
            )} {!isSidebarOpen && (
              <button
                onClick={() => setIsModalOpen(true)}
                className=""
              >
                <ArrowUpCircleIcon height={30} width={30} />
              </button>
            )}

            {isSidebarOpen && transitionComplete && (
              <Link
                href={`/organizations/${params.abc}/dashboard`}
                className={`block p-2 px-4 text-sm rounded-[100px] transition duration-200 font-semibold  ${isActive(`/organizations/${params.abc}/dashboard`)
                  ? "bg-[#c2e7ff] text-black"
                  : "hover:bg-gray-300"
                  }  `}
              >
                <div className={`flex items-center `}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png"
                    width={17}
                    height={17}
                    alt=""
                  />
                  <span className="text-sm font-semibold ml-2">Dashboard</span>
                </div>
              </Link>
            )}  {!isSidebarOpen && (
              <Link
                href={isTenantIncluded ? `/${tenantDetails.name}/dashboard` : "/dashboard"}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png"
                  width={20}
                  height={20}
                  alt=""
                />
              </Link>
            )}
            {isSidebarOpen && transitionComplete && status === "authenticated" && userDetails?.role === 'ADMIN' && (
              <Link
                href={isTenantIncluded ? `/${tenantDetails.name}/admin/sharepage` : "/admin/sharepage"}
                className={`block p-2 px-4 text-sm rounded-[100px] transition duration-200 font-semibold  ${isActive("/admin/sharepage") || isActive(`/${tenantDetails.name}/admin/sharepage`)
                  ? "bg-[#c2e7ff] text-black"
                  : "hover:bg-gray-300"
                  } `}
              >
                <div className={`flex items-center `}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png"
                    width={17}
                    height={17}
                    alt=""
                  />
                  <span className="text-sm font-semibold ml-2">Share Invite</span>
                </div>
              </Link>
            )}  {!isSidebarOpen && status === "authenticated" && userDetails?.role === 'ADMIN' && (
              <Link
                href={isTenantIncluded ? `/${tenantDetails.name}/admin/sharepage` : "/admin/sharepage"}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png"
                  width={20}
                  height={20}
                  alt=""
                />
              </Link>
            )}
            {/* More links */}
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 ">
            <div className={`${isSidebarOpen ? "max-w-full ml-[10.5rem] pr-[10.5rem]" : "max-w-full ml-[2.5rem] pr-[2.5rem]"} transition-all duration-200 ease-linear container mx-auto px-6`}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
