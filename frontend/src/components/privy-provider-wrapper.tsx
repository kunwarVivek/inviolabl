'use client';
import { useAuth } from "@clerk/nextjs";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseGoerli, baseSepolia, sepolia } from "viem/chains";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionId, getToken } = useAuth();

  return (
    <PrivyProvider
      appId='clrpwag8h01twla0f9uckte9d'
      config={{
        customAuth: {
          isLoading: false,
          getCustomAccessToken: async () => {
            try {
              const token = await getToken(); 
              console.log(token);
              return token; 
            } catch (error) {
              console.error("Error fetching token:", error);
              throw error; 
            }
          },
        },
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'permission-icon.jpg'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: false
        },
        // Import your desired chain from `viem/chains` and pass it to `defaultChain`
        defaultChain: sepolia,
        supportedChains: [baseSepolia, sepolia]
      }}
    >
      {children}
    </PrivyProvider>
  );
}
