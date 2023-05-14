import React, { useEffect, useCallback } from 'react'
import axios from 'axios';
import { Table } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function NativeTokens({chain, setChain, wallet, setWallet, nativeBalance, setNativeBalance, nativeValue, setNativeValue, selectedCurrency, setSelectedCurrency}) {

  const getNativeBalance = useCallback(async () => {
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
  }, [wallet, chain, selectedCurrency, setNativeBalance, setNativeValue]);

  useEffect(() => {
    if(wallet){
      getNativeBalance().catch((err) => {
        console.error(err);
      });
    }
  }, [wallet, chain, selectedCurrency, getNativeBalance]);

  return (
    <>
        <div className='tabHeading'>Native Balance <Reload onClick={getNativeBalance} /> </div>
        {(nativeBalance > 0 && nativeValue > 0) &&
          <Table
            pageSize={1}
            noPagination={true}
            style={{ width: '900px' }}
            columnsConfig='300px 300px 250px'
            data={[["Native", nativeBalance, `$ ${nativeValue}`]]}
            header={[
              <span>Currency</span>,
              <span>Balance</span>,
              <span>Value</span>
            ]}
          />  
        }
    </>
  )
}

export default NativeTokens


/* return (
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

export default NativeTokens */