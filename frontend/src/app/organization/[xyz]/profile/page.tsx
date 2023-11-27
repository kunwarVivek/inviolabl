
"use client";
import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {

  const [profileTab, setProfileTab] = useState(true)
  const [notificationTab, setNotificationTab] = useState(false)

  const [profile, setProfile] = useState({
    username: "RajKumar",
    email: "rajkumar@gmail.com",
    phone: "+91 73389 65230",
    walletId: "0x123...abc",
    profileUrl: "/metamask-icon.svg",
    bannerUrl: "/background-image.png",
  });

  const profileFormFields = [
    { label: 'Username', placeholder: 'Username', id: 'username' },
    { label: 'Email', placeholder: 'Email', id: 'email' },
    { label: 'Wallet ID', placeholder: 'Wallet ID', id: 'walletId', disabled: true },
    { label: 'Mobile Number', placeholder: 'Phone Number', id: 'mobileNumber' },
    { label: 'Your Site', placeholder: 'Website Url', id: 'siteUrl' },
    { label: 'Twitter username', placeholder: 'Twitter username', id: 'twitterUsername' },
    { label: 'Instagram username', placeholder: 'Instagram username', id: 'instagramUsername' },
  ]

  const notificationFields = [
    { title: 'Item Sold', description: 'When someone purchased your item.', value: 'itemSold' },
    { title: 'Auction Expiration', description: 'When an auction you created ends.', value: 'auctionExpiration' },
    { title: 'Bid Activity', description: 'When someone purhased your item.', value: 'bidActivity' },
    { title: 'Outbid', description: 'When an offer you placed is exceeded by another user.', value: 'outBid' },
    { title: 'Price Change', description: 'When an item you made an offer on changes in price.', value: 'priceChange' },
    { title: 'Successful Purchase', description: 'When you successfully buy an item.', value: 'successfulPurchase' },
  ]

  const handleProfileBtn = () => {
    setNotificationTab(false)
    setProfileTab(true)
  }

  const handleNotificationBtn = () => {
    setProfileTab(false)
    setNotificationTab(true)
  }

  return (
    <div className=" min-h-screen bg-white">
      <Header />
      <div className="wallet_background h-72 flex justify-center items-center mb-10">
        <h1 className="text-5xl text-white font-bold">Edit Profile</h1>
      </div>
      <div className="container  max-w-screen-lg mx-auto p-4 ">
        <div className="flex mb-10 mt-3">
          <button onClick={handleProfileBtn} type="button" className={`${profileTab ? "bg-[#403f83] text-[white]" : "bg-[#eee] text-[#8364e2] hover:bg-slate-300"} text-[#8364e2] text-sm font-bold rounded-sm px-5 py-2.5 text-center inline-flex items-center me-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${profileTab ? "fill-[white]" : "fill-[#8364e2]"} me-2`} height="14px" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
            Profile
          </button>
          <button onClick={handleNotificationBtn} type="button" className={`${notificationTab ? "bg-[#403f83] text-[white]" : "bg-[#eee] text-[#8364e2] hover:bg-slate-300"} text-[#8364e2] text-sm font-bold rounded-sm px-5 py-2.5 text-center inline-flex items-center me-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`${notificationTab ? "fill-[white]" : "fill-[#8364e2]"} me-2`} height="14px" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
            Notifications
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:gap-5 mb-10">
          {/* Left column for input fields */}
          {/* {profileTab && <>
            <form className="flex flex-col w-2/3 gap-3" autoComplete="off">
              {profileFormFields.map((inputField, index) => (
                <div className="mb-4" key={index}>
                  <label
                    className="block text-gray-700 text-md font-bold mb-1"
                    htmlFor={inputField.id}
                  >
                    {inputField.label}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={inputField.id}
                    type="text"
                    placeholder={inputField.placeholder}
                    disabled={inputField.disabled}
                  />
                </div>
              ))}
            </form>

            <div className="flex-1">
              <div className="mb-4">

                <label
                  className="block text-gray-700 text-md font-bold mb-1"
                  htmlFor="Wallet ID"
                >
                  Profile Pic
                </label>
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                  <img src={profile.profileUrl} alt="Profile" />
                </div>
              </div>
              <div className="mb-4">

                <label
                  className="block text-gray-700 text-md font-bold mb-1"
                  htmlFor="Wallet ID"
                >
                  Profile Banner
                </label>
                <div className="w-full h-32 overflow-hidden rounded-lg border-2 border-gray-300">
                  <img src={profile.bannerUrl} alt="Banner" />
                </div>
              </div>
            </div>
          </>} */}
          {profileTab&&<UserProfile path="/organization/:xyz/profile" routing="path" />}
          {notificationTab&&<>
            <div className="flex flex-wrap gap-4">
              {notificationFields.map((checkbox, index) => (
                <div key={index} className="w-full md:w-[48%] mb-4">
                  <div className="border-[0.1px] border-gray-300 overflow-hidden rounded-sm">
                    <div className="px-6 py-6">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-md mb-3 mt-3">{checkbox.title}</div>
                        <label className="relative cursor-pointer">
                          <input type="checkbox" value={checkbox.value} className="peer sr-only" />
                          <div className="peer h-5 w-10 rounded-full bg-gray-400 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#8364E2] peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                      <p className="text-gray-700">
                        {checkbox.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>}
        </div>

        <button className="p-2 px-6 mb-4 text-white text-sm bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 font-bold leading-[1em] rounded-md">
          Update Profile
        </button>
      </div>
    </div>
  );
}
