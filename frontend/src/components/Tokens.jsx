import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ReactLoading from "react-loading";
import TabList from './TabList';
import Tab from './Tab';

function Tokens({chain, wallet, tokensData, setTokensData, selectedCurrency}) {

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(1);

    const formatNumber = (num) => {
      let symbol = selectedCurrency === "USD" ? "$" : "€";
      if (!num) return "No Price";
      if (num < 0.1) {
        let precision = Math.ceil(Math.abs(Math.log10(num))) + 1;
        return `${symbol}${num.toFixed(precision)}`;
      }
      return `${symbol}${num.toFixed(2)}`;
    }
    
  

    const getBalances = useCallback(async () => {
      try {
        const tokenBalancesRequest = axios.get("http://localhost:5000/tokenBalances", {
          params: {
            address: wallet,
            chain: chain,
          },
        });
      
        const nativeBalanceRequest = axios.get("http://localhost:5000/nativeBalance", {
          params: {
            address: wallet,
            chain: chain,
          },
        });
      
        const [tokenBalancesResponse, nativeBalanceResponse] = await Promise.all([
          tokenBalancesRequest,
          nativeBalanceRequest,
        ]);
      
        // Process the responses
        const tokenBalancesData = tokenBalancesResponse.data;
        const nativeBalanceData = nativeBalanceResponse.data;
      
        if(tokenBalancesData && nativeBalanceData) {
          const { all, legit, spam } = tokenBalancesData;
      
          const processTokens = (tokens) => {
            return tokens.map(t => {
                let dVal = t.usd ? ((Number(t.balance) / Number(`1e${t.decimals}`)) * Number(t.usd)).toFixed(2) : 0;
                let eVal = t.eur ? ((Number(t.balance) / Number(`1e${t.decimals}`)) * Number(t.eur)).toFixed(2) : 0;
                return {
                    ...t,
                    bal: (Number(t.balance) / Number(`1e${t.decimals}`)).toFixed(2),
                    dVal: dVal,
                    eVal: eVal
                };
            });
          }
          
          let nb = {
            symbol: nativeBalanceData.symbol,
            bal : (Number(nativeBalanceData.balance) / 1e18).toFixed(2),
            dVal: ((Number(nativeBalanceData.balance) / 1e18) * Number(nativeBalanceData.usd)).toFixed(2),
            eVal: ((Number(nativeBalanceData.balance) / 1e18) * Number(nativeBalanceData.eur)).toFixed(2),
            usd: nativeBalanceData.usd,
            eur: nativeBalanceData.eur,
            token_address: nativeBalanceData.token_address,
          };

          setTokensData({
            all: [nb, ...processTokens(all)],
            legit: [nb, ...processTokens(legit)],
            spam: processTokens(spam),
          });
          
      
        }

        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    
    }, [wallet, chain, setTokensData]);

    useEffect(() => {
        if(wallet){
            setIsLoading(true);
            getBalances().catch((err) => {
                console.error(err);
            });
        }
    }, [wallet, chain, getBalances]);

    const redirectToTokenDetails = (token) => {
      let redirectUrl = "";
      if (chain === "0x38") {
        redirectUrl = `https://dexscreener.com/bsc/${token.token_address}`;
      } else if (chain === "0x1") {
        redirectUrl = `https://dexscreener.com/ethereum/${token.token_address}`;
      }
      window.open(redirectUrl, "_blank");
    };

    const renderTable = (data) => (
      <div className="overflow-x-auto">
        <div className="min-w-screen flex items-center justify-center font-sans overflow-hidden">
          <div className="w-full">
            <div className="bg-zinc-700 shadow-md rounded-lg my-6 overflow-hidden">
              <table className="min-w-max w-full table-auto drop-shadow-md">
                <thead>
                  <tr className="bg-zinc-800 text-white-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Token</th>
                    <th className="py-3 px-6 text-left">Balance</th>
                    <th className="py-3 px-6 text-left">Value</th>
                    <th className="py-3 px-6 text-left">Price</th>
                  </tr>
                </thead>
                <tbody className="text-white-600 text-sm font-semibold">
                  {data.map((e, index) => (
                    <tr className="hover:bg-zinc-600" key={e.symbol} onClick={() => redirectToTokenDetails(e)}>
                      <td className="py-3 px-6 text-left whitespace-nowrap">{e.symbol}</td>
                      <td className="py-3 px-6 text-left">{e.bal}</td>
                      <td className="py-3 px-6 text-left">
                        {selectedCurrency === "USD" ? 
                          (e.dVal === 0 ? "No Value" : `$${e.dVal}`) 
                          : 
                          (e.eVal === 0 ? "No Value" : `€${e.eVal}`)}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {selectedCurrency === "USD" ? 
                          formatNumber(e.usd)
                          : 
                          formatNumber(e.eur)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <>
        {/* <div className="tabHeading"> Tokens </div> */}
        {isLoading ? (
          <ReactLoading type="cylon" color="#687994" height={100} width={50} /> 
        ) : (
          tokensData?.all?.length > 0 && (
            <>
              <TabList onTabChange={(selectedKey) => {setActiveTab(selectedKey + 1); console.log("Selected tab:", selectedKey);}}>
                  <Tab>Legit</Tab>
                  <Tab>Spam</Tab>
                  <Tab>All</Tab>
              </TabList>
  
              <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                {renderTable(tokensData.legit)}
              </div>

              <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                {renderTable(tokensData.spam)}
              </div>

              <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
                {renderTable(tokensData.all)}
              </div>
          </>
        )
      )}
    </>
  )

}

export default React.memo(Tokens);