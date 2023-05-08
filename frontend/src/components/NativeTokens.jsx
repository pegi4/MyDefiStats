import React from 'react'
import axios from 'axios';

function NativeTokens({chain, setChain, wallet, setWallet, nativeBalance, setNativeBalance, nativeValue, setNativeValue, selectedCurrency, setSelectedCurrency}) {

  async function getNativeBalance() {

    const response = await axios.get("http://localhost:5000/nativeBalance", {
      params: {
        address: wallet,
        chain: chain,
      }
    });

    if(response.data.balance && response.data.usd && response.data.eur){
      setNativeBalance((Number(response.data.balance) / 1e18).toFixed(3));

      if(selectedCurrency === "USD") {
        setNativeValue(((Number(response.data.balance) / 1e18) * Number(response.data.usd)).toFixed(2));
      } else if(selectedCurrency === "EUR") {
          setNativeValue(((Number(response.data.balance) / 1e18) * Number(response.data.eur)).toFixed(2));
      }
    }

  }

  return (
    <>
      <h1>Fetch Tokens</h1>
      <p>
        <button onClick={getNativeBalance}>Fetch Tokens</button>
        <br />
        <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <br />
        <span>
          Native Balance: {nativeBalance}, {selectedCurrency === "USD" ? "$ " : "€ "}{nativeValue}
        </span>
      </p>
    </>
  )
}

export default NativeTokens
