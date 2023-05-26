import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Table } from '@web3uikit/core';
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
        return `${symbol} ${num.toFixed(precision)}`;
      }
      return `${symbol} ${num.toFixed(2)}`;
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
  
              {/* Render the components conditionally, but don't unmount them when not active */}
              <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: 'auto' }}
                    columnsConfig='auto auto auto auto'
                    data={tokensData.legit.map((e) => [
                      e.symbol, 
                      e.bal, 
                      selectedCurrency === "USD" ? 
                        (e.dVal === 0 ? "No Value" : `${e.dVal} $`) 
                        : 
                        (e.eVal === 0 ? "No Value" : `${e.eVal} €`),
                        selectedCurrency === "USD" ? 
                        formatNumber(e.usd)
                        : 
                        formatNumber(e.eur),
                      
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>,
                        <span>Price</span>,
                    ]}
                />
              </div>
  
              <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: 'auto' }}
                    columnsConfig='auto auto auto auto'
                    data={tokensData.spam.map((e) => [
                      e.symbol, 
                      e.bal, 
                      selectedCurrency === "USD" ? 
                        (e.dVal === 0 ? "No Value" : `${e.dVal} $`) 
                        : 
                        (e.eVal === 0 ? "No Value" : `${e.eVal} €`),
                        selectedCurrency === "USD" ? 
                        formatNumber(e.usd)
                        : 
                        formatNumber(e.eur),
                      
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>,
                        <span>Price</span>,
                    ]}
                />
              </div>
  
              <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
              <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: 'auto' }}
                    columnsConfig='auto auto auto auto'
                    data={tokensData.all.map((e) => [
                      e.symbol, 
                      e.bal, 
                      selectedCurrency === "USD" ? 
                        (e.dVal === 0 ? "No Value" : `$${e.dVal}`) 
                        : 
                        (e.eVal === 0 ? "No Value" : `€${e.eVal}`),
                        selectedCurrency === "USD" ? 
                        formatNumber(e.usd)
                        : 
                        formatNumber(e.eur),
                      
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>,
                        <span>Price</span>,
                    ]}
                />
            </div>
          </>
        )
      )}
    </>
  )

}

export default React.memo(Tokens);