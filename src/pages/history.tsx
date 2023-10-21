import Head from "next/head"
import { useEffect } from "react"
import { useActorMethod } from "service/hello"
import styles from "styles/History.module.css"

import Image from "next/image"

interface purchaseProps {}

const purchase: React.FC<purchaseProps> = ({}) => {
  const { loading, error, data, call } = useActorMethod("get_transaction_list")

  useEffect(() => {
    call()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Purchase History</title>
      </Head>
      <main className={styles.main}>
        <h3 className={styles.title}>Purchase History</h3>
        {loading && <div>Processing Purchase on ICP...</div>}
        {error ? <div>{error.toString()}</div> : null}
        {data ? (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr className={styles.tableRow}>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Hash</th>
                <th className={styles.tableHeader}>Buyer</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {data.map(([hash, buyer], id) => {
                return (
                  <tr key={id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{id + 1}</td>
                    <td className={styles.tableCell}>
                      <a href={`https://sepolia.etherscan.io/tx/${hash}`}>
                        {hash}
                      </a>
                    </td>
                    <td className={styles.tableCell}>{buyer}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : null}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://internetcomputer.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            width={140}
            height={30}
            src="/icp-logo.svg"
            alt="DFINITY logo"
            className={styles.logo}
          />
        </a>
      </footer>
    </div>
  )
}

export default purchase
