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
    
      // Check if the decimal part is zero
      const decimalPart = num - Math.floor(num);
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPart === 0 ? 0 : 2, // if decimal part = 0 then min 0 fraction digits otherwise 2
        maximumFractionDigits: 2,
      });
      
      return `${symbol}${formatter.format(num)}`;
    };    
    
    const formatBalance = (balance) => {
      if (balance === 0) {
        return "0.00";
      }
      else if (balance < 0.001) {
        let precision = Math.ceil(Math.abs(Math.log10(balance))) + 1;
        return balance.toFixed(precision);
      }
      const decimalPart = balance - Math.floor(balance);
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPart > 0 ? 2 : 0, // if decimal part > 0 then min 2 fraction digits otherwise 0
        maximumFractionDigits: 2,
      });
      return formatter.format(balance);
    };    

    const formatValue = (num) => {
      if (num < 0.01) return `0.00`;
      
      // Check if the decimal part is zero
      const decimalPart = num - Math.floor(num);
      let decimals = decimalPart === 0 ? 0 : 2;
    
      // Number formatting
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      
      return `${formatter.format(num)}`;
    };

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
              let balance = Number(t.balance) / Number(`1e${t.decimals}`);
              let dVal = t.usd ? (balance * Number(t.usd)).toFixed(2) : 0;
              let eVal = t.eur ? (balance * Number(t.eur)).toFixed(2) : 0;
              return {
                  ...t,
                  bal: formatBalance(balance),
                  dVal: dVal,
                  eVal: eVal
              };
            });
          };          
          
          let nb = {
            symbol: nativeBalanceData.symbol,
            bal: formatBalance(Number(nativeBalanceData.balance) / 1e18),
            dVal: ((Number(nativeBalanceData.balance) / 1e18) * Number(nativeBalanceData.usd)).toFixed(2),
            eVal: ((Number(nativeBalanceData.balance) / 1e18) * Number(nativeBalanceData.eur)).toFixed(2),
            usd: nativeBalanceData.usd,
            eur: nativeBalanceData.eur,
            token_address: nativeBalanceData.token_address,
          };
        
          if(nb.bal > 0) {
            setTokensData({
              all: [nb, ...processTokens(all)],
              legit: [nb, ...processTokens(legit)],
              spam: processTokens(spam),
            });
          }
          
        } else {
          setTokensData({
            all: [],
            legit: [],
            spam: [],
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
            setTokensData({
              all: [],
              legit: [],
              spam: [],
            });
            getBalances().catch((err) => {
                console.error(err);
            });
        }
    }, [wallet, chain, getBalances, setTokensData]);

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
                          (e.dVal === 0 ? "No Value" : `$${formatValue(e.dVal)}`) 
                          : 
                          (e.eVal === 0 ? "No Value" : `€${formatValue(e.eVal)}`)}
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
          tokensData?.all?.length > 0 ? (
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
          ) : (
            <div className="noDataMessage">You don't have any tokens on this chain.</div>
          )
        )}
    </>
  )

}

export default Tokens;