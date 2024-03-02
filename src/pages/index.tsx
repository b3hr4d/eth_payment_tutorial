import Head from "next/head"

import styles from "styles/Home.module.css"

import Wallet from "components/Wallet"
import Image from "next/image"
import { config } from "service/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"

const queryClient = new QueryClient()

function HomePage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ETH payment</title>
      </Head>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Direct Ethereum Payment on the Internet Computer
        </h3>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Wallet />
          </QueryClientProvider>
        </WagmiProvider>
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

export default HomePage
