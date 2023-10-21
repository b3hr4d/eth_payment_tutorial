import { useAccount, useConnect, useDisconnect } from "wagmi"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import Shop from "./Shop"

interface WalletProps {}

const Wallet: React.FC<WalletProps> = ({}) => {
  const { address } = useAccount()

  const { connect } = useConnect({
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
  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default Wallet
