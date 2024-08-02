import { AppProps } from "next/app"
import React from "react"
import "styles/global.css"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div>
      <nav>
        <a href="/">Home</a> | <a href="/history">Purchase History</a>
      </nav>
      <br />
      <Component {...pageProps} />
    </div>
  )
}

export default App
