import React, { useState, useEffect, useContext, useMemo } from "react";
import { ConnectedWallet, useWallets } from "@privy-io/react-auth";
import {
  Client,
  RpcTransactionRequest,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { baseGoerli } from "viem/chains";
import {
  WalletClientSigner,
  type SmartAccountSigner,
  PublicErc4337Client,
  createPublicErc4337Client,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import {
  BASE_GOERLI_ALCHEMY_RPC_URL,
  BASE_GOERLI_ENTRYPOINT_ADDRESS,
  BASE_GOERLI_PAYMASTER_URL,
} from "../library/constants";
import { populateWithPaymaster, signUserOp } from "../library/user-operations";


interface SmartAccountInterface {
  
  eoa?: ConnectedWallet;
  
  smartAccountSigner?: SmartAccountSigner;
  
  smartAccountProvider?: AlchemyProvider;
  
  smartAccountAddress?: `0x${string}` | undefined;
  
  sendSponsoredUserOperation: (
    transactionRequest: RpcTransactionRequest
  ) => Promise<`0x${string}`>;
  
  smartAccountReady: boolean;
}

const SmartAccountContext = React.createContext<SmartAccountInterface>({
  eoa: undefined,
  smartAccountSigner: undefined,
  smartAccountProvider: undefined,
  smartAccountAddress: undefined,
  sendSponsoredUserOperation: () => {
    throw new Error("Not implemented.");
  },
  smartAccountReady: false,
});

export const useSmartAccount = () => {
  return useContext(SmartAccountContext);
};

export const SmartAccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  
  const { wallets } = useWallets();
  
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  
  const [smartAccountReady, setSmartAccountReady] = useState(false);
  const [eoa, setEoa] = useState<ConnectedWallet | undefined>();
  const [smartAccountSigner, setSmartAccountSigner] = useState<
    SmartAccountSigner | undefined
  >();
  const [smartAccountProvider, setSmartAccountProvider] = useState<
    AlchemyProvider | undefined
  >();
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | undefined
  >();

  
  const paymaster: any = useMemo(
    () =>
      createPublicClient({
        chain: baseGoerli,
        transport: http(BASE_GOERLI_PAYMASTER_URL),
      }),
    []
  );

  
  const bundler: PublicErc4337Client = useMemo(
    () =>
      createPublicErc4337Client({
        chain: baseGoerli,
        rpcUrl: `${BASE_GOERLI_ALCHEMY_RPC_URL}/${
          process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string
        }`,
      }),
    []
  );

  useEffect(() => {
    
    const createSmartWallet = async (eoa: ConnectedWallet) => {
      setEoa(eoa);
      
      const eoaProvider = await eoa.getEthereumProvider();
      const eoaClient = createWalletClient({
        account: eoa.address as `0x${string}`,
        chain: baseGoerli,
        transport: custom(eoaProvider),
      });

    
      const signer: SmartAccountSigner = new WalletClientSigner(
        eoaClient,
        "json-rpc"
      );
      setSmartAccountSigner(signer);

      const provider = new AlchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
        chain: baseGoerli,
        entryPointAddress: BASE_GOERLI_ENTRYPOINT_ADDRESS,
      }).connect(
        (rpcClient) =>
          new LightSmartContractAccount({
            entryPointAddress: BASE_GOERLI_ENTRYPOINT_ADDRESS,
            chain: rpcClient.chain,
            owner: signer,
            factoryAddress: getDefaultLightAccountFactoryAddress(rpcClient.chain),
            rpcClient,
          })
      );
      setSmartAccountProvider(provider);

      const address = await provider.getAddress();
      setSmartAccountAddress(address);
      setSmartAccountReady(true);
    };

    if (embeddedWallet) createSmartWallet(embeddedWallet);
  }, [embeddedWallet?.address]);

  const sendSponsoredUserOperation = async (
    transactionRequest: RpcTransactionRequest
  ) => {
    if (
      !smartAccountProvider ||
      !smartAccountProvider ||
      !smartAccountAddress
    ) {
      throw new Error("Smart account has not yet initialized.");
    }

    
    const userOp = await smartAccountProvider.buildUserOperationFromTx(
      transactionRequest
    );


    const populatedUserOp = await populateWithPaymaster(userOp, paymaster);

    
    const signedUserOp = await signUserOp(
      populatedUserOp,
      smartAccountProvider
    );

    
    const userOpHash = await bundler.sendUserOperation(
      signedUserOp,
      BASE_GOERLI_ENTRYPOINT_ADDRESS
    );
    return userOpHash;
  };

  return (
    <SmartAccountContext.Provider
      value={{
        smartAccountReady: smartAccountReady,
        smartAccountProvider: smartAccountProvider,
        smartAccountSigner: smartAccountSigner,
        smartAccountAddress: smartAccountAddress,
        sendSponsoredUserOperation: sendSponsoredUserOperation,
        eoa: eoa,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
};
