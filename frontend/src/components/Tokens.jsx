import React from 'react'
import axios from 'axios'

function Tokens({chain, wallet, tokens, setTokens}) {

    async function getTokenBalances() {
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
    }

  return (
    <>
        <p>
            <button onClick={getTokenBalances}>Get Tokens</button>
            <br />
            {tokens.length > 0 && tokens.map((e) => {
                return (
                    <>
                    <span key={e.address}>
                        {e.symbol} {e.bal}, (${e.val})
                    </span>
                    <br />
                    </>
                )
            })}

        </p>
    </>
  )
}

export default Tokens