"use client";
import Dashboard from "@/components/Dashboard";
import React, { useState, useEffect } from "react";
import { ShareIcon } from "@heroicons/react/24/solid";
import DropdownMenu from "@/components/DropdownMenu";
// import { useValidation } from "@/components/Validation";
import loading from "@/app/loading";
import { OrganizationList, useAuth, useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";

const page = ({ params }) => {

  const userDetails = useSelector(
    (state: RootState) => state.user.details
  );

  const {  userId, sessionId, getToken } = useAuth();


  const {
    organization: currentOrganization,
    membership,
    isLoaded,
  } = useOrganization();


  console.log(userDetails)

  const { user } = useUser(); // Assuming you have a way to get the user ID

  const [userFiles, setUserFiles] = useState([]);
  console.log(userFiles)

  useEffect(() => {
    const fetchUserFiles = async () => {
      
      try {
        if (currentOrganization.id) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants/${currentOrganization.id}/files`,
          {
            headers: {
              'Session_id': sessionId,
            }});
          setFileHistory(response.data);
          setUserFiles(response.data)
        }
      } catch (error) {
        console.error('Error fetching user files:', error);
      }
    };

    fetchUserFiles();
  }, [user]);

  const [filter, setFilter] = useState('all');
  const [fileHistory, setFileHistory] = useState([
    // { filename: "resume.pdf", size: "1mb", createdAt: "yesterday", status: "Success" },
  ]);
  console.log(filter);

  // const isLoading = useValidation(params.xyz)

  // if (isLoading) {
  //     return loading
  //   }

  const filteredFileHistory = filter === 'all'
    ? fileHistory
    : fileHistory.filter(file => file && file.filename && file.filename.endsWith(`.${filter.toLowerCase()}`));

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter.toLowerCase());
  };
  const typeOptions = ["All", "PDF", "JPG", "PNG", "JPEG"];
  const modifiedOptions = ["Today", "Last Week", "Last Month"];

  return (

    <div className="bg-white min-h-screen">
      <Dashboard>
        <div className="overflow-x-auto min-h-screen bg-white rounded-md border shadow-2xl">
          <table className="min-w-full bg-white ">
            <thead className="bg-white text-black ">
              <tr>
                <th colSpan={4} className="py-2">
                  <div className="pl-10 py-5 bg-slate-100 text-start space-x-4 mt-14 mb-2">
                    <span className="font-semibold text-xl">File History</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={4} className="py-2">
                  <div className="ml-10 text-start space-x-4 mb-5">
                    <DropdownMenu buttonText="Type" options={typeOptions} onSelect={handleFilterChange} />
                    <DropdownMenu
                      buttonText="Modified"
                      options={modifiedOptions}
                      onSelect={handleFilterChange}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th
                  className="px-5 pl-10 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  FILE NAME
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  SIZE
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  UPLOADED ON
                </th>

                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  UPLOADED BY
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredFileHistory.map((file, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 pl-10 border-b border-gray-200 bg-white text-sm">
                    <span>{file.fileName}</span>
                    <button
                      onClick={() => {/* Implement share functionality */ }}
                      className="ml-2 hover:text-blue-500"
                    >
                      <ShareIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.fileSize}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.createdAt}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{file.uploadedBy}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">success</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dashboard>
    </div>

  );
};

export default page;
