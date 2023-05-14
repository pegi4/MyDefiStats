import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Table } from '@web3uikit/core';
import ReactLoading from "react-loading";

function Tokens({chain, wallet, tokens, setTokens}) {

    const [isLoading, setIsLoading] = useState(true);

    const getTokenBalances = useCallback(async () => {
        const response = await axios.get("http://localhost:5000/tokenBalances", {
            params: {
                address: wallet,
                chain: chain,
            }
        });
    
        if(response.data) {
            let t = response.data;

            for(let i = 0; i < t.length; i++) {
                t[i].bal = (Number(t[i].balance) / Number(`1e${t[i].decimals}`)).toFixed(3); //1e18
                t[i].val = ((Number(t[i].balance) / Number(`1e${t[i].decimals}`))* Number(t[i].usd)).toFixed(3);
            }

            setTokens(t);
        }

        setIsLoading(false);
    }, [wallet, chain, setTokens]);

    useEffect(() => {
        if(wallet){
            getTokenBalances().catch((err) => {
                console.error(err);
            });
        }
    }, [wallet, chain, getTokenBalances]);

  return (
    <>
        <div className="tabHeading"> Tokens </div>
        {isLoading ? 
            (
                <ReactLoading type="cylon" color="#687994" height={100} width={50} /> 
            ) 
        : tokens.length > 0 && 
            (
                <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: '900px' }}
                    columnsConfig='300px 300px 250px'
                    data={tokens.map((e) => [e.symbol, e.bal, `$ ${e.val}`])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>
                    ]}
                />
            )
        }
    </>
  )
}

export default Tokens