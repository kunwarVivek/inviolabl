"use client";
import { usePathname, useRouter } from "next/navigation";
import { TruncatedWalletAddress } from "./TruncateFunction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ConnectWallet = () => {
  const pathname = usePathname();
  const tenantDetails = useSelector(
    (state: RootState) => state.tenant.details
  );
  const isTenantIncluded = pathname.includes(tenantDetails.name);
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
  return (
    <div className="flex items-center gap-4">
      <div className={`${MetaMaskAccount && "w-48"} text-white`}>
        {!MetaMaskAccount && (
          <button
            className="p-1 bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold"
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        )}
        {MetaMaskAccount && (
          <p className="text-center  p-2 w-fit rounded-md font-semibold">
            <span className="inline-block mt-1 bg-slate-300 p-1 rounded-md text-black px-4">
              {TruncatedWalletAddress(MetaMaskAccount)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
