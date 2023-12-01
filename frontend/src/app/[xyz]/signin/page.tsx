"use client";
import GoogleLogin from "@/components/Authentication";
import Header from "@/components/Header";
import { RootState } from "@/store/store";
import { SignIn } from "@clerk/nextjs";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Auth = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const tenantDetails = useSelector((state: RootState) => state.tenant.details);
  const isTenantIncluded =
    tenantDetails && pathname.includes(tenantDetails?.name);
  console.log(window.location.hostname);
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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  if (status === "authenticated") {
    router.push(`/${tenantDetails?.name}/dashboard`);
  }
  if (status === "loading") {
    return (
      <>
        <h1>Loading</h1>
      </>
    );
  }
  if (status === "unauthenticated") {
    return (
      <>
        <div className="background-url min-h-screen">
          <Header
            className={`text-white sticky z-50 py-5 ${isScrolled && "bg-[#403f83]"
              }`}
          />

          <div
            className={`container mx-auto flex justify-between items-center px-6 ${isSignUp ? "pt-10" : "py-16"
              } max-w-7xl`}
          >
            <div className="w-1/2">
              <h1 className="text-5xl font-bold max-w-lg text-white mb-6">
                Share information securely.
              </h1>
              <p className="text-white max-w-lg text-lg mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua ut
                enim.
              </p>
            </div>
            <div className="w-1/2 max-w-md">
              <SignIn afterSignInUrl="/organization" />
            </div>
          </div>
        </div>
      </>
    );
  }
  return null;
};

export default Auth;






