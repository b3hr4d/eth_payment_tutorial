import { useEffect } from "react"
import { useActorMethod } from "service/hello"

interface VerifyTransactionProps {
  item: string
  hash: string
}

const VerifyTransaction: React.FC<VerifyTransactionProps> = ({
  item,
  hash
}) => {
  const { loading, error, data, call } = useActorMethod("buy_item")

  useEffect(() => {
    call(item, hash)
  }, [hash])

  if (loading) {
    return <div>Processing Purchase on ICP...</div>
  } else if (error) {
    return <div>{error.toString()}</div>
  } else if (data) {
    return (
      <div>
        <h3>{item} bought!</h3>
        <div>Purchase ID: {data.toString()}</div>
      </div>
    )
  } else {
    return null
  }
}

export default VerifyTransaction
