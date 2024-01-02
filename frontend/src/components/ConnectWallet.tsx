"use client";
import { usePathname, useRouter } from "next/navigation";
import { TruncatedWalletAddress } from "./TruncateFunction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useClerk } from "@clerk/nextjs";

const ConnectWallet = () => {

  const pathname = usePathname();
  const tenantDetails = useSelector(
    (state: RootState) => state.tenant.details
  );
  const isTenantIncluded = tenantDetails && pathname.includes(tenantDetails?.name);
  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );



  const router = useRouter();

  const handleConnect = () => {
    if (isTenantIncluded) {
      router.push(`/${tenantDetails.name}/wallet`);
    } else {
      router.push("/wallet");
    }
  };
  const isWalletConnected = typeof window !== "undefined" && window.ethereum && window.ethereum.selectedAddress;

  

  return (
    <div className="flex items-center gap-4">
      <div className={` text-white`}>
        {!isWalletConnected && (
          <button
            className="p-1 bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold"
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        )}
        {isWalletConnected && (
          <p className="text-center  p-2 w-fit rounded-md font-semibold">
            <span className="inline-block mt-1 bg-slate-300 p-1 rounded-md text-black px-4">
              Connected
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
