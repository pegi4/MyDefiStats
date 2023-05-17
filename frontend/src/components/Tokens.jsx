import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Table, TabList, Tab } from '@web3uikit/core';
import ReactLoading from "react-loading";

function Tokens({chain, wallet, allTokens, setAllTokens, legitTokens, setLegitTokens, spamTokens, setSpamTokens, selectedCurrency, setSelectedCurrency}) {

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(1);

    const getTokenBalances = useCallback(async () => {
        const response = await axios.get("http://localhost:5000/tokenBalances", {
          params: {
            address: wallet,
            chain: chain,
          }
        });
      
        if(response.data) {
          const { all, legit, spam } = response.data;
      
          const processTokens = (tokens) => {
            return tokens.map(t => {
                let dVal = t.usd ? ((Number(t.balance) / Number(`1e${t.decimals}`)) * Number(t.usd)).toFixed(3) : 0;
                let eVal = t.eur ? ((Number(t.balance) / Number(`1e${t.decimals}`)) * Number(t.eur)).toFixed(3) : 0;
                return {
                    ...t,
                    bal: (Number(t.balance) / Number(`1e${t.decimals}`)).toFixed(3),
                    dVal: dVal,
                    eVal: eVal
                };
            });
          }        
      
          setAllTokens(processTokens(all));
          setLegitTokens(processTokens(legit));
          setSpamTokens(processTokens(spam));
        }
      
        setIsLoading(false);
    }, [wallet, chain, setAllTokens, setLegitTokens, setSpamTokens]);

    useEffect(() => {
        if(wallet){
            setIsLoading(true);
            getTokenBalances().catch((err) => {
                console.error(err);
            });
        }
    }, [wallet, chain, getTokenBalances]);

    return (
      <>
        <div className="tabHeading"> Tokens </div>
        {isLoading ? (
          <ReactLoading type="cylon" color="#687994" height={100} width={50} /> 
        ) : (
          allTokens.length > 0 && (
            <>
              <TabList
                onChange={(selectedKey) => {
                  console.log("Tokens tab:", selectedKey);
                  setActiveTab(selectedKey);
                }}>
                <Tab tabKey={1} tabName={"Legit"} />
                <Tab tabKey={2} tabName={"Spam"} />
                <Tab tabKey={3} tabName={"All"} />
              </TabList>
  
              {/* Render the components conditionally, but don't unmount them when not active */}
              <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: '900px' }}
                    columnsConfig='300px 300px 250px'
                    data={legitTokens.map((e) => [
                      e.symbol, 
                      e.bal, 
                      selectedCurrency === "USD" ? 
                        (e.dVal === 0 ? "No price" : `$ ${e.dVal}`) 
                        : 
                        (e.eVal === 0 ? "No price" : `€ ${e.eVal}`)
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>
                    ]}
                />
              </div>
  
              <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: '900px' }}
                    columnsConfig='300px 300px 250px'
                    data={spamTokens.map((e) => [
                      e.symbol, 
                      e.bal, 
                      selectedCurrency === "USD" ? 
                        (e.dVal === 0 ? "No price" : `$ ${e.dVal}`) 
                        : 
                        (e.eVal === 0 ? "No price" : `€ ${e.eVal}`)
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>
                    ]}
                />
              </div>
  
              <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
              <Table 
                    pageSize={6}
                    noPagination="true"
                    style={{ width: '900px' }}
                    columnsConfig='300px 300px 250px'
                    data={allTokens.map((e) => [
                      e.symbol, 
                      e.bal, 
                      selectedCurrency === "USD" ? 
                        (e.dVal === 0 ? "No price" : `$ ${e.dVal}`) 
                        : 
                        (e.eVal === 0 ? "No price" : `€ ${e.eVal}`)
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Balance</span>,
                        <span>Value</span>
                    ]}
                />
            </div>
          </>
        )
      )}
    </>
  )

}

export default Tokens