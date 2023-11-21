"use client";
import Dashboard from "@/components/Dashboard";
import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { ChevronDownIcon, ShareIcon } from "@heroicons/react/24/solid";
import DropdownMenu from "@/components/DropdownMenu";

const page = () => {
  const [filter, setFilter] = useState('all');
  const [fileHistory, setFileHistory] = useState([
    { name: "resume.pdf", size: "1mb", uploadedOn: "yesterday", status: "Success" },
    { name: "housedocument.pdf", size: "3.5mb", uploadedOn: "today", status: "Success" },
    { name: "photo.png", size: "2mb", uploadedOn: "last week", status: "Success" },
    { name: "image.jpg", size: "2.5mb", uploadedOn: "two days ago", status: "Success" },
    { name: "image.jpeg", size: "2.5mb", uploadedOn: "two days ago", status: "Success" },
  ]);
  console.log(filter);

  const filteredFileHistory = filter === 'all'
    ? fileHistory
    : fileHistory.filter(file => file.name.endsWith(`.${filter.toLowerCase()}`));

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter.toLowerCase());
  };
  const typeOptions = ["All", "PDF", "JPG", "PNG", "JPEG"];
  const modifiedOptions = ["Today", "Last Week", "Last Month"];

  return (
    <div className="bg-white min-h-screen">
      <Dashboard>
        <div className="overflow-x-auto rounded-md border shadow-2xl">
          <table className="min-w-full bg-white ">
            <thead className="bg-white text-black ">
              <tr>
                <th
                  colSpan={4}
                  className="text-start py-3 px-4 font-semibold text-2xl"
                >
                  File History
                </th>
              </tr>
              <tr className="">
                <th colSpan={4} className="py-2">
                  <div className="ml-5 text-start space-x-4">
                    <DropdownMenu buttonText="Type" options={typeOptions} onSelect={handleFilterChange} />
                    <DropdownMenu
                      buttonText="Modified"
                      options={modifiedOptions}
                      onSelect={handleFilterChange}
                    />
                  </div>
                </th>
              </tr>
              <tr>
                <th className="text-left text-gray py-3 px-4 text-sm border-b border-gray-200">
                  File Name
                </th>
                <th className="text-left text-gray py-3 px-4 text-sm border-b border-gray-200">
                  Size
                </th>
                <th className="text-left text-gray py-3 px-4 text-sm border-b border-gray-200">
                  Uploaded On
                </th>
                <th className="text-left text-gray py-3 px-4 text-sm border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredFileHistory.map((file, index) => (
                <tr>
                  <td className="text-left py-3 px-4 flex items-center border-b border-gray-200">
                    <span>{file.name}</span>
                    <button
                      onClick={() => {/* Implement share functionality */ }}
                      className="ml-2 hover:text-blue-500"
                    >
                      <ShareIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{file.size}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{file.uploadedOn}</td>
                  <td className="text-left py-3 px-4 border-b border-gray-200">{file.status}</td>
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
