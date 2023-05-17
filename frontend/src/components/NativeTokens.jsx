import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { Table } from '@web3uikit/core';
import ReactLoading from "react-loading";

function NativeTokens({chain, setChain, wallet, setWallet, nativeBalance, setNativeBalance, nativeValue, setNativeValue, selectedCurrency, setSelectedCurrency}) {

  const [isLoading, setIsLoading] = useState(true);
  const [nativeSymbol, setNativeSymbol] = useState('Native');

  const getNativeBalance = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/nativeBalance", {
      params: {
        address: wallet,
        chain: chain,
      }
    });

    let r = response.data;

    if(r.balance && r.usd && r.eur && r.symbol){
      setNativeBalance((Number(r.balance) / 1e18).toFixed(3));
      setNativeValue({
        usd: ((Number(r.balance) / 1e18) * Number(r.usd)).toFixed(2),
        eur: ((Number(r.balance) / 1e18) * Number(r.eur)).toFixed(2)
      });

/*       if(selectedCurrency === "USD") {
        setNativeValue(((Number(r.balance) / 1e18) * Number(r.usd)).toFixed(2));
      } else if(selectedCurrency === "EUR") {
          setNativeValue(((Number(r.balance) / 1e18) * Number(r.eur)).toFixed(2));
      } */

      setNativeSymbol(r.symbol);

    }
    setIsLoading(false);
  }, [wallet, chain, setNativeBalance, setNativeValue]);

  useEffect(() => {
    if(wallet){
      getNativeBalance().catch((err) => {
        console.error(err);
      });
    }
  }, [wallet, chain, getNativeBalance]);

  return (
    <>
        <div className='tabHeading'>Native Balance </div>
        {isLoading ? 
            (
              <ReactLoading type="cylon" color="#687994" height={100} width={50} /> 
            ) 
        : nativeBalance && nativeValue &&
            (
              <Table
                pageSize={1}
                noPagination={true}
                style={{ width: '900px' }}
                columnsConfig='300px 300px 250px'
                data={[[nativeSymbol, nativeBalance, `${selectedCurrency === "USD" ? "$" : "€"} ${nativeValue[selectedCurrency.toLowerCase()]}`]]}
                header={[
                  <span>Currency</span>,
                  <span>Balance</span>,
                  <span>Value</span>
                ]}
              />  
            )
        }
    </>
  )
}

export default NativeTokens