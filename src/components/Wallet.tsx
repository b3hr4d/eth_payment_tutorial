import { useAccount, useConnect, useDisconnect } from "wagmi"
import Shop from "./Shop"
import { injected, walletConnect } from "wagmi/connectors"
import { projectId } from "service/config"

interface WalletProps {}

const Wallet: React.FC<WalletProps> = ({}) => {
  const { address } = useAccount()

  const { disconnect } = useDisconnect()

  const { connect } = useConnect()

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
      <button
        onClick={() =>
          connect({
            connector: injected()
          })
        }
      >
        Metamask
      </button>
      <button
        onClick={() =>
          connect({
            connector: walletConnect({
              projectId,
              metadata: {
                name: "ICPPayment",
                description: "Internet Computer Payment",
                url: "https://github.com/B3Pay",
                icons: ["https://avatars.githubusercontent.com/u/121541974"]
              }
            })
          })
        }
      >
        WalletConnect
      </button>
    </div>
  )
}

export default Wallet
