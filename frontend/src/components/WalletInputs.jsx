import React from 'react'

function WalletInputs({chain, setChain, wallet, setWallet}) {
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

export default WalletInputs