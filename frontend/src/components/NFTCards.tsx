"use client";
import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const NFTCards = () => {
  return (
    <div className="flex flex-col md:flex-row mt-6 gap-5 justify-between items-center max-w-screen-xl mx-auto mb-5 px-4">
      {/* Text Area */}
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <div className="p-6 md:p-12 bg-[#8364e222] rounded">
          <div className="bg-purple-400 w-fit p-3 rounded mb-4">
            <Icon icon="tabler:wallet" color="white" width="30" height="30" />
          </div>
          <p className="font-bold text-lg">Set up your wallet</p>
          <p className="pt-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem.
          </p>
        </div>
      </div>
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <div className="p-6 md:p-12 bg-[#8364e222] rounded">
          <div className="bg-purple-400 w-fit p-3 rounded mb-4">
            <Icon
              icon="mdi:cloud-upload-outline"
              color="white"
              width="30"
              height="30"
            />
          </div>
          <p className="font-bold text-lg">Add your NFTs</p>
          <p className="pt-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <div className="p-6 md:p-12 bg-[#8364e222] rounded">
          <div className="bg-purple-400 w-fit p-3 rounded mb-4">
            <Icon
              icon="fluent:tag-multiple-16-regular"
              color="white"
              width="30"
              height="30"
            />
          </div>

          <p className="font-bold text-lg">Sell your NFTs</p>
          <p className="pt-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTCards;