import React from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const GoogleLogin = () => {

  const pathname = usePathname();
  const tenantDetails = useSelector(
    (state: RootState) => state.tenant.details
  );
  const isTenantIncluded = tenantDetails && pathname.includes(tenantDetails?.name);
  return (
    <div className="mb-5">
      <div className="bg-white p-8 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {isTenantIncluded
            ? (pathname === `/${tenantDetails?.name}/signup` ? "Sign Up" : "Sign In")
            : (pathname === '/signup' ? "Sign Up" : "Sign In")
          }
        </h2>

        {tenantDetails && isTenantIncluded
          ? (pathname === `/${tenantDetails.name}/signup` ? <SignUp /> : <SignIn />)
          : (pathname === '/signup' ? <SignUp /> : <SignIn />)
        }

        <div className="text-center p-1 px-3 mt-4">
          {isTenantIncluded ? (
            <span className="p-1 px-5 text-white rounded-md cursor-pointer inline-block bg-red-600">
              {pathname === `/${tenantDetails.name}/signup` ? (
                <Link href={`/${tenantDetails.name}/signin`}>Go to Sign In</Link>
              ) : (
                <Link href={`/${tenantDetails.name}/signup`}>Go to Sign Up</Link>
              )}
            </span>
          ) : (
            <span className="p-1 px-5 text-white rounded-md cursor-pointer inline-block bg-red-600">
              {pathname === "/signup" ? (
                <Link href="/signin">Go to Sign In</Link>
              ) : (
                <Link href="/signup">Go to Sign Up</Link>
              )}
            </span>
          )}
        </div>
        <div className="mt-3 mb-3">
          <div className="flex items-center justify-center mt-3 mb-3">
            <div className="flex-grow border-t-2"></div>
            <span className="px-4 text-base font-medium text-body-color">
              Or
            </span>
            <div className="flex-grow border-t-2"></div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => signIn("google")}
            className="border-stroke dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
          >
            <span className="mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_95:967)">
                  <path
                    d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                    fill="#34A853"
                  />
                  <path
                    d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                    fill="#EB4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_95:967">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
