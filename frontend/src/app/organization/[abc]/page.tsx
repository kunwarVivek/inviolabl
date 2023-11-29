"use client";
import loading from "@/app/loading";
import BrowseCategory from "@/components/BrowseCategory";
import Header from "@/components/Header";
import HotCollections from "@/components/HotCollections";
import LandingHeroSection from "@/components/LandingHeroSection";
import NFTCards from "@/components/NFTCards";
import NewCollections from "@/components/NewItems";
// import { useValidation } from "@/components/Validation";


export default function HeroSection({ params }) {

    // const isLoading = useValidation(params.xyz)
    // console.log(params.xyz)

    // if (isLoading) {
    //     return loading
    //   }

  return (
    <div className="min-h-screen bg-white">
      <Header bgColor="bg-white" />

      <LandingHeroSection />
      <NFTCards />
      <HotCollections />
      <NewCollections />
      <BrowseCategory />
    </div>
  );
}
