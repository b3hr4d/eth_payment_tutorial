import Head from "next/head"
import { useEffect } from "react"
import { useActorMethod } from "service/hello"
import styles from "styles/History.module.css"

import Image from "next/image"
import { formatEther } from "viem"

interface purchaseProps {}

const purchase: React.FC<purchaseProps> = ({}) => {
  const { loading, error, data, call } = useActorMethod("get_transaction_list")
  const {
    data: balance,
    loading: loadingBalance,
    call: callBalance
  } = useActorMethod("balance")

  useEffect(() => {
    call()
    callBalance()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Purchase History</title>
      </Head>
      <main className={styles.main}>
        <h3 className={styles.title}>Purchase History</h3>
        {loadingBalance && <div>Fetching balance...</div>}
        {balance ? (
          <div className={styles.balanceValue}>
            Balance: {formatEther(balance)} ckETH
          </div>
        ) : null}
        {loading && <div>Processing Purchase on ICP...</div>}
        {error ? <div>{error.toString()}</div> : null}
        {data ? (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr className={styles.tableRow}>
                <th className={styles.tableHeader}>Hash</th>
                <th className={styles.tableHeader}>Buyer</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {data.map(([hash, buyer]) => {
                return (
                  <tr key={hash} className={styles.tableRow}>
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
