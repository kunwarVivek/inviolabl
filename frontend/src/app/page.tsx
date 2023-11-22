"use client";
import BrowseCategory from "@/components/BrowseCategory";
import Header from "@/components/Header";
import HotCollections from "@/components/HotCollections";
import LandingHeroSection from "@/components/LandingHeroSection";
import NFTCards from "@/components/NFTCards";
import NewCollections from "@/components/NewItems";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  console.log(window.location.hostname)
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
  return (
    <div className="min-h-screen bg-white">
      <Header className={`${isScrolled && "bg-[#fff] border-b border-gray-200"}`} />
      <LandingHeroSection />
      <NFTCards />
      <HotCollections />
      <NewCollections />
      <BrowseCategory />
    </div>
  );
}
