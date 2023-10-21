import { useEffect } from "react"
import { useActorMethod } from "service/hello"
import Item from "./Item"

import styles from "styles/Shop.module.css"

interface ShopProps {}

const Shop: React.FC<ShopProps> = ({}) => {
  const { data: items, loading, call } = useActorMethod("get_items")

  useEffect(() => {
    call()
  }, [])

  return (
    <div className={styles.container}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        items?.map(([name, price]) => {
          return <Item name={name} price={price} key={name} />
        })
      )}
    </div>
  )
}

export default Shop
