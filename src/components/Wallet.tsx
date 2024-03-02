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
              projectId
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
