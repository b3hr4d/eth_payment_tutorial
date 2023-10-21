import { useEffect } from "react"
import { useActorMethod } from "service/hello"
import Item from "./Item"

interface ShopProps {}

const Shop: React.FC<ShopProps> = ({}) => {
  const { data: items, loading, call } = useActorMethod("get_items")

  useEffect(() => {
    call()
  }, [])

  return (
    <div
      style={{
        marginTop: 10,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridGap: 20
      }}
    >
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
