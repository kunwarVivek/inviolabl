import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { mainnet, polygon } from 'wagmi/chains'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet,polygon],
  [alchemyProvider({ apiKey: 'bLLtGgauy0CV5QsFILBzCcVU2o5mNq4S' })],
)

export const config = createConfig({
  publicClient,
  
  webSocketPublicClient,
})
