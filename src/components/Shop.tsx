import Item from "./Item"

import styles from "styles/Shop.module.css"
import { useQueryCall } from "service/payment"

interface ShopProps {}

const Shop: React.FC<ShopProps> = ({}) => {
  const { data, call, loading } = useQueryCall({ functionName: "get_items" })

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <h3>Items for Sale</h3>
        <button onClick={call} className={styles.refresh}>
          ⟳
        </button>
      </div>
      <div className={styles.items}>
        {loading ? (
          <div>Loading...</div>
        ) : data && data.length > 0 ? (
          data.map(([name, price]) => {
            return <Item name={name} price={price} key={name} />
          })
        ) : (
          <div>No items available</div>
        )}
      </div>
    </div>
  )
}

export default Shop
