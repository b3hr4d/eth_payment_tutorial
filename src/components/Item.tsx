import { useEffect } from "react"
import helperAbi from "service/abi.json"
import { formatEther } from "viem"
import Confirmation from "./Confirmation"

import styles from "styles/Item.module.css"
import { useWriteContract } from "wagmi"
import { useQueryCall } from "service/payment"

interface ItemProps {
  name: string
  price: bigint
}

const Item: React.FC<ItemProps> = ({ name, price }) => {
  const { data: canisterDepositAddress } = useQueryCall({
    functionName: "canister_deposit_principal"
  })

  const { data, isPending, writeContract } = useWriteContract()

  const buy = () => {
    writeContract({
      address: "0xb44B5e756A894775FC32EDdf3314Bb1B1944dC34",
      abi: helperAbi,
      functionName: "deposit",
      value: price,
      args: [canisterDepositAddress]
    })
  }

  return (
    <div className={styles.item}>
      {isPending ? (
        <div>Buying {name}…</div>
      ) : data ? (
        <Confirmation hash={data} item={name} />
      ) : (
        <>
          <h3>{name}</h3>
          <div>{formatEther(price).toString()} ETH</div>
          <button onClick={buy}>Buy {name}</button>
        </>
      )}
    </div>
  )
}

export default Item
