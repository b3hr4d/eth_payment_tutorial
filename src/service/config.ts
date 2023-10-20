import { createPublicClient, http } from "viem"
import { createConfig, sepolia } from "wagmi"

export const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    )
  })
})
