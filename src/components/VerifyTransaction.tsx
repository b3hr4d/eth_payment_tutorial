import { useEffect } from "react"
import { useActorMethod } from "service/hello"
import { formatEther } from "viem"

interface VerifyTransactionProps {
  hash: string
}

const VerifyTransaction: React.FC<VerifyTransactionProps> = ({ hash }) => {
  const { loading, error, data, call } = useActorMethod("verify_transaction")

  useEffect(() => {
    call(hash)
  }, [hash])

  if (loading) {
    return <div>Processing…</div>
  } else if (error) {
    return <div>{error.toString()}</div>
  } else if (data) {
    return (
      <div>
        Transaction(<b>{hash}</b>) with <b>{formatEther(data[0])}</b>ETH from{" "}
        <b>{data[1]}</b> is confirmed on-chain.
      </div>
    )
  } else {
    return null
  }
}

export default VerifyTransaction
