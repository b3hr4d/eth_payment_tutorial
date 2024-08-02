import { useEffect } from "react"
import { useQueryCall } from "service/payment"
import { formatEther } from "viem"

interface VerifyTransactionProps {
  hash: string
}

const VerifyTransaction: React.FC<VerifyTransactionProps> = ({ hash }) => {
  const { loading, error, data, call } = useQueryCall({
    functionName: "verify_transaction"
  })

  useEffect(() => {
    call([hash])
  }, [hash])

  if (loading) {
    return <div>Processing…</div>
  } else if (error) {
    return <div>{error.toString()}</div>
  } else if (data) {
    return (
      <div>
        Transaction(<b>{hash}</b>) with <b>{formatEther(data.amount)}</b>ETH
        from <b>{data.from}</b> is confirmed on-chain.
      </div>
    )
  } else {
    return null
  }
}

export default VerifyTransaction
