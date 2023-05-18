import WalletInputs from './components/WalletInputs';
import Tokens from './components/Tokens';
import Porfolio from './components/PortfolioValue';
import TransferHistory from './components/TransferHistory';
import Nfts from './components/Nfts';
import './App.css';

import { useState, useEffect } from 'react';
import { TabList, Tab, Select, CryptoLogos } from '@web3uikit/core';
import { Blockie } from '@web3uikit/web3';

function App() {

  const [wallet, setWallet] = useState(localStorage.getItem('wallet') || "");
  const [chain, setChain] = useState(localStorage.getItem('chain') || "0x1");  

  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [tokensData, setTokensData] = useState({
    all: [],
    legit: [],
    spam: [],
  });

  const [transfers, setTransfers] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  // function to switch currency
  const switchCurrency = () => {
    setSelectedCurrency(selectedCurrency === "USD" ? "EUR" : "USD");
    console.log("Switch currency to: ", selectedCurrency)
  };

  useEffect(() => {
    localStorage.setItem('wallet', wallet);
  }, [wallet]);
  
  useEffect(() => {
    localStorage.setItem('chain', chain);
  }, [chain]);

  

  return (
    <div className="App">

      <WalletInputs
        chain={chain}
        setChain={setChain}
        wallet={wallet}
        setWallet={setWallet}
      />

      <div className="content">

        <div className="blockie">
          <Blockie
            seed={wallet}
            scale={10}
          />
          <p>{wallet}</p>

          <button onClick={switchCurrency}>Switch Currency</button>
          <span> {selectedCurrency} </span>

        </div>

        <Porfolio
          tokens={tokensData.legit}
          setTokensData={setTokensData}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />

        <TabList
          onChange={(selectedKey) => {
            console.log("Selected tab:", selectedKey);
            setActiveTab(selectedKey);
          }}
        >
          <Tab tabKey={1} tabName={"Tokens"} />
          <Tab tabKey={2} tabName={"Transfers"} />
          <Tab tabKey={3} tabName={"NFTs"} />
          <Select
          defaultOptionIndex={chain === "0x1" ? 0 : 1}
          id="Chain"
          onChange={(e) => {
            if (chain !== e.value) {
              setChain(e.value);
            }
          }}
          options={[
            { 
              id: "eth",
              value: "0x1",
              label: "Ethereum",
              prefix: <CryptoLogos chain="ethereum" />,
            },
            {
              id: "bsc",
              value: "0x38",
              label: "Binance Smart Chain",
              prefix: <CryptoLogos chain="binance" />,
            },
          ]}
        />
        </TabList>

        {/* Render the components conditionally, but don't unmount them when not active */}
        <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Tokens
            wallet={wallet}
            chain={chain}
            tokensData={tokensData}
            setTokensData={setTokensData}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </div>

        <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <TransferHistory
            wallet={wallet}
            chain={chain}
            transfers={transfers}
            setTransfers={setTransfers}
          />
        </div>

        <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
          <Nfts
            wallet={wallet}
            chain={chain}
            nfts={nfts}
            setNfts={setNfts}
            filteredNfts={filteredNfts}
            setFilteredNfts={setFilteredNfts}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
