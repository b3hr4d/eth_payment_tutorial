import { sepolia, useAccount, useConnect, useDisconnect } from "wagmi"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import Shop from "./Shop"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!

interface WalletProps {}

const Wallet: React.FC<WalletProps> = ({}) => {
  const { address } = useAccount()

  const { connect: walletConnect } = useConnect({
    connector: new WalletConnectConnector({
      chains: [sepolia],
      options: {
        projectId,
        metadata: {
          name: "ICPPayment",
          description: "Internet Computer Payment",
          url: "https://github.com/B3Pay",
          icons: ["https://avatars.githubusercontent.com/u/121541974"]
        }
      }
    })
  })

  const { connect: metamask } = useConnect({
    connector: new MetaMaskConnector()
  })

  const { disconnect } = useDisconnect()

  if (address)
    return (
      <main>
        Connected to: {address}
        <button onClick={() => disconnect()}>Disconnect</button>
        <Shop />
      </main>
    )
  return (
    <div>
      <button onClick={() => metamask()}>Metamask</button>
      <button onClick={() => walletConnect()}>WalletConnect</button>
    </div>
  )
}

export default Wallet
