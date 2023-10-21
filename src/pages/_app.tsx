import { AppProps } from "next/app"
import React from "react"
import "styles/global.css"
import { ReActorProvider } from "../service/hello"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ReActorProvider>
      <nav>
        <a href="/">Home</a> | <a href="/history">Purchase History</a>
      </nav>
      <br />
      <Component {...pageProps} />
    </ReActorProvider>
  )
}

export default App
