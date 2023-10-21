import { Hash } from "viem"
import { useWaitForTransaction } from "wagmi"
import VerifyTransaction from "./VerifyTransaction"

interface ConfirmationProps {
  item: string
  hash: Hash
}

const Confirmation: React.FC<ConfirmationProps> = ({ item, hash }) => {
  const { data, isError, error, isLoading } = useWaitForTransaction({
    hash,
    confirmations: 2
  })

  if (isError && error) {
    return <div>Transaction error {error.toString()}</div>
  } else if (isLoading) {
    return <div>Waiting for confirmation on Ethereum…</div>
  } else if (data) {
    return <VerifyTransaction hash={data.transactionHash} item={item} />
  } else {
    return null
  }
}

export default Confirmation
