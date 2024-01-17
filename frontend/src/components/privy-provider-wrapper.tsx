'use client';
import { PrivyProvider } from "@privy-io/react-auth";
import { baseGoerli, baseSepolia, sepolia } from "viem/chains";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId='clpispdty00ycl80fpueukbhl'
      config={{
        /* Replace this with your desired login methods */
        loginMethods: ['email', 'wallet'],
        /* Replace this with your desired appearance configuration */
        appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'permission-icon.jpg'
        },
        embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            noPromptOnSignature: true
        },
        // Import your desired chain from `viem/chains` and pass it to `defaultChain`
        defaultChain: baseGoerli,
    }}
    >
      {children}
    </PrivyProvider>
  );
}
