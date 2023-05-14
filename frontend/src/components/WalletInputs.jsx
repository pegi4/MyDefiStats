import React from 'react'
import "../App.css"
import { Input, Select, CryptoLogos } from '@web3uikit/core'

function WalletInputs({chain, setChain, wallet, setWallet}) {
  return (
    <>
        <div className='header'>
          <div className='title'>
            <svg width="40" height="40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'top'}}>
            <path id="logo_exterior" d="M500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500C388.071 500 500 388.071 500 250Z" fill="#784FFE"></path>
            <path id="logo_interior" fill-rule="evenodd" clip-rule="evenodd" d="M154.338 187.869L330.605 187L288.404 250.6L388 250.118L345.792 312.652L168.382 313.787L211.25 250.633L112 250.595L154.338 187.869Z" fill="white"></path>
            </svg>
            <h1>My Defi Stats</h1>
          </div>
          <div className='walletInputs'>
            <Input 
              id="wallet"
              label="Wallet Address"
              placeholder="0x..."
              labelBgColor="rgb(33, 33, 38)"
              style={{height: "50x"}}
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
            <Select
              defaultOptionIndex={chain === "0x1" ? 0 : 1}
              id="Chain"
              onChange={(e) => setChain(e.value)}
              options={[
                { 
                  id: "eth",
                  value: "0x1",
                  label: "Ethereum",
                  prefix: <CryptoLogos chain="ethereum" />,
                },
                {
                  id: "bsc",
                  value: "0x38",
                  label: "Binance Smart Chain",
                  prefix: <CryptoLogos chain="binance" />,
                },
              ]}
            />

          </div>
        </div>
    </>
  )
}

export default WalletInputs

/* function WalletInputs({chain, setChain, wallet, setWallet}) {
  return (
    <>
        <h1> Input a Wallet and Chain</h1>
        <p>
            <span>Set Wallet </span>
            <input
                onChange={(e) => setWallet(e.target.value)}
                value={wallet}
            ></input>
        </p>
        <span>Set Chain </span>
        <select onChange={(e) => setChain(e.target.value)} value={chain}>
            <option value="0x1">Eth</option>
            <option value="0x89">Polygon</option>
            <option value="0x38">Bsc</option>
            <option value="0x19">Cronos</option>
        </select>
    </>
  )
}

export default WalletInputs */