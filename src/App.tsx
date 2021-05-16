import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Orders } from './features/orders/Orders'
import { Wallet } from './features/wallet/Wallet'
import './App.css'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <Wallet />
        <Orders />
        ☠️ Use at your own risk
      </div>
    </Web3ReactProvider>
  )
}

export default App
