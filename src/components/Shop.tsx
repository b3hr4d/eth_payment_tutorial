import Item from "./Item"

import styles from "styles/Shop.module.css"
import { useQueryCall } from "service/payment"

interface ShopProps {}

const Shop: React.FC<ShopProps> = ({}) => {
  const { data: items, loading } = useQueryCall({ functionName: "get_items" })

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
