import { createClient, http } from "viem"
import { sepolia } from "viem/chains"
import { createConfig } from "wagmi"
import { injected, walletConnect } from "wagmi/connectors"

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "ICPPayment",
        description: "Internet Computer Payment",
        url: "https://github.com/B3Pay",
        icons: ["https://avatars.githubusercontent.com/u/121541974"]
      }
    }),
    injected()
  ],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  }
})
