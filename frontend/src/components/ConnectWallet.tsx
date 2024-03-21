"use client";
import { usePathname, useRouter } from "next/navigation";
import { TruncatedWalletAddress } from "./TruncateFunction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useClerk } from "@clerk/nextjs";
import { useLogin, usePrivy } from "@privy-io/react-auth";

const ConnectWallet = () => {

  const pathname = usePathname();
  const tenantDetails = useSelector(
    (state: RootState) => state.tenant.details
  );
  const isTenantIncluded = tenantDetails && pathname.includes(tenantDetails?.name);
  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );

  const { ready, authenticated, user } = usePrivy()
  
  const router = useRouter();

  const handleConnect = () => {
    if (isTenantIncluded) {
      router.push(`/${tenantDetails.name}/wallet`);
    } else {
      router.push("/wallet");
    }
  };
  // const isWalletConnected = typeof window !== "undefined" && window.ethereum && window.ethereum.selectedAddress;

  

  return (
    <div className="flex items-center gap-4">
      <div className={` text-white`}>
        {user && (
          <>
          <p className="text-center  p-2 w-fit rounded-md font-semibold">
            <span className="text-sm font-semibold bg-slate-300 p-1 rounded-md text-black px-4">
              {(user?.wallet?.address)}
            </span>
          </p>
        </>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
