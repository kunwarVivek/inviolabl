"use client";
import { setUser } from "@/features/LoginSlice";
import { setAccount } from "@/features/PrivySlice";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useClerk,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import MagicBell, {
  FloatingNotificationInbox,
} from "@magicbell/magicbell-react";
import { useWallets } from "@privy-io/react-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConnectWallet from "./ConnectWallet";
import MagicBellClient, { Notification } from "@magicbell/core";


const Header = ({ className }: any) => {
  MagicBellClient.configure({ apiKey: '644b158683d2a357dc593625a99be3edc344a6fe', apiSecret: '8zQx0ykxUj89n9A7G6CmY5U+lcsjqNsqe7e/3VE0' });
  const [userEmail, setUserEmail] = useState("");
  const { data: session, status } = useSession();
  const { isLoaded, userId, sessionId, getToken, orgId } = useAuth();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const { organization: currentOrganization, membership } = useOrganization();

  const { organization } = useOrganization();

  console.log(currentOrganization)
  console.log(orgId)

  const isAdmin = membership?.role === "admin";

  console.log(signOut);

  const { user } = useUser();

  console.log(user);
  console.log(user?.primaryEmailAddress.emailAddress);

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  useEffect(() => {
    // Check if user exists before dispatching
    if (user) {
      dispatch(setUser(user));
    }
    if (embeddedWallet) {
      dispatch(setAccount(embeddedWallet.address));
    }
  }, [dispatch, user, embeddedWallet]);

  const MetaMaskAccount = useSelector(
    (state: RootState) => state.metaMask.account
  );
  const Logo = useSelector(
    (state: RootState) => state.organisationSettings.logo
  );
  const tenantDetails = useSelector((state: RootState) => state.tenant.details);
  const userDetails = useSelector((state: RootState) => state.user.details);

  console.log(userDetails);

  console.log(userDetails?.primaryEmailAddress.emailAddress);

  const isTenantIncluded =
    tenantDetails && pathname.includes(tenantDetails?.name);
  console.log(isTenantIncluded);

  const [showCopied, setShowCopied] = useState(false);
  console.log(status, session);

  const handleCopy = (e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(MetaMaskAccount);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 3000); // Hide message after 3 seconds
  };
  return (
    <nav
      className={cn(
        `fixed top-0 left-0 right-0 z-10 text-black py-3 mx-auto transition-all duration-200 ease-in-out`,
        className
      )}
    >
      <div
        className={` transform max-w-screen-xl mx-auto  container  flex justify-between items-center px-6`}
      >
        <div className="flex items-center space-x-4">
          <Link href={isTenantIncluded ? `/${tenantDetails.name}` : "/"}>
            {" "}
            <div className="text-2xl font-bold">{Logo}</div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {status === "authenticated" && (
            <Link
              href={
                isTenantIncluded
                  ? `/${tenantDetails.name}/dashboard`
                  : "/dashboard"
              }
            >
              <span className="text-sm font-semibold">Dashboard</span>
            </Link>
          )}
          {/* <ConnectWallet /> */}
          {sessionId && <Link href={"/organization"}>
            <span className="py-[5.5px] px-4 mb-4 text-white text-sm bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 font-semibold rounded-md">{currentOrganization ? `Organization - ${currentOrganization.name}` : `Organization`}</span>
          </Link>}
          {!sessionId && <Link href={"/organization"}>
            <span className="py-[5.5px] px-4 mb-4 text-white text-sm bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 font-semibold rounded-md">Try it free</span>
          </Link>}
          
          {sessionId && (
            <MagicBell
              apiKey={"644b158683d2a357dc593625a99be3edc344a6fe"}
              userEmail={userDetails?.primaryEmailAddress.emailAddress}
              theme={{
                icon: { borderColor: "#8B5CF6" },
              }}
            >
              {(props) => (
                <FloatingNotificationInbox
                  height={350}
                  placement="bottom-start"
                  closeOnClickOutside={true}
                  {...props}
                />
              )}
            </MagicBell>
          )}

          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Header;
