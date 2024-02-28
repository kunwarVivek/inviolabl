"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Header from "./Header";
import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import {
  ArrowUpCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import { useOrganization } from "@clerk/nextjs";

const Dashboard = ({ children }) => {
  const pathname = usePathname();
  const { organization } = useOrganization();

  const {
    organization: currentOrganization,
    membership,
    isLoaded,
  } = useOrganization();

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      router.replace(`https://alpha.inviolabl.io/organization/${currentOrganization?.name}/dashboard`)
    };
    handleScroll()
  }, [currentOrganization?.name]);


  const isAdmin = membership?.role === "admin";

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
          <nav className={`flex flex-col ${!isSidebarOpen && "items-center"} px-2 pt-10 ${!isSidebarOpen ? "gap-10" : "gap-4"}`}>
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
                href={`/organization/${currentOrganization?.name}/dashboard`}
                className={`block p-2 px-4 text-sm rounded-[100px] transition duration-200 font-semibold  ${isActive(`/organization/${currentOrganization?.name}/dashboard`)
                  ? "bg-[#c1acff] text-black"
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
                href={organization ? `/organization/${currentOrganization?.name}/dashboard` : "/dashboard"}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png"
                  width={20}
                  height={20}
                  alt=""
                />
              </Link>
            )}
            {isSidebarOpen && transitionComplete && isAdmin && (
              <Link
                href={organization ? `/organization/${organization?.name}/sharepage` : "/admin/sharepage"}
                className={`block p-2 px-4 text-sm rounded-[100px] transition duration-200 font-semibold  ${isActive(`/organization/${organization?.name}/sharepage`)
                  ? "bg-[#c1acff] text-black"
                  : "hover:bg-gray-300"
                  } `}
              >
                <div className={`flex items-center `}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M215.4 96H144 107.8 96v8.8V144v40.4 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3V96c0-26.5 21.5-48 48-48h76.6l49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48H416c26.5 0 48 21.5 48 48v44.3l22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4v-89V144 104.8 96H404.2 368 296.6 215.4zM0 448V242.1L217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1V448v0c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v0zM176 160H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>

                  <span className="text-sm font-semibold ml-2">Invite</span>
                </div>
              </Link>
            )}  {!isSidebarOpen && isAdmin && (
              <Link
                href={organization ? `/organization/${organization?.name}/sharepage` : "/admin/sharepage"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M215.4 96H144 107.8 96v8.8V144v40.4 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3V96c0-26.5 21.5-48 48-48h76.6l49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48H416c26.5 0 48 21.5 48 48v44.3l22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4v-89V144 104.8 96H404.2 368 296.6 215.4zM0 448V242.1L217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1V448v0c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v0zM176 160H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
              </Link>
            )}
            {/* {isSidebarOpen && transitionComplete && (
              <Link
                href={organization ? `/organization/${organization?.name}/fileaccess` : "/admin/sharepage"}
                className={`block p-2 px-4 text-sm rounded-[100px] transition duration-200 font-semibold  ${isActive(`/organization/${organization?.name}/fileaccess`)
                  ? "bg-[#c1acff] text-black"
                  : "hover:bg-gray-300"
                  } `}
              >
                <div className={`flex items-center `}>  
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" /></svg>
                  

                  <span className="text-sm font-semibold ml-2">Access</span>
                </div>
              </Link>
            )}  {!isSidebarOpen && (
              <Link
                href={organization ? `/organization/${organization?.name}/fileaccess` : "/admin/sharepage"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" /></svg>

              </Link>
            )} */}
            {/* {isSidebarOpen && transitionComplete && (
              <Link
                href={organization ? `/organization/${organization?.name}/sharedfiles` : "/admin/sharepage"}
                className={`block p-2 px-4 text-sm rounded-[100px] transition duration-200 font-semibold  ${isActive(`/organization/${organization?.name}/sharedfiles`)
                  ? "bg-[#c1acff] text-black"
                  : "hover:bg-gray-300"
                  } `}
              >
                <div className={`flex items-center `}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/></svg>
                
                  <span className="text-sm font-semibold ml-2">Shared<br/>FIles</span>
                </div>
              </Link>
            )}  {!isSidebarOpen  && (
              <Link
                href={organization ? `/organization/${organization?.name}/sharedfiles` : "/admin/sharepage"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/></svg>

              </Link>
            )} */}
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

