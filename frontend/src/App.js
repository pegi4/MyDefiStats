import WalletInputs from './components/WalletInputs';
import Tokens from './components/Tokens';
import Porfolio from './components/PortfolioValue';
import TransferHistory from './components/TransferHistory';
import Nfts from './components/Nfts';
import './App.css';

import { useState, useEffect } from 'react';
import { TabList, Tab} from '@web3uikit/core';
import Blockie from 'react-blockies';

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
          <div className="blockie-content">
            <div rounded-md>
              <Blockie className='rounded-2xl' seed={wallet} scale={14} />
            </div>
            <div className="wallet-info">
              <p className="wallet-address">{wallet}</p>
              <Porfolio
                className="portfolio"
                tokens={tokensData.legit}
                setTokensData={setTokensData}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
              />
            </div>
          </div>
          <div className="currency-dropdown">
            <div className="currency-selector">
              <div className="currency-text">{selectedCurrency}</div>
              <div className="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
                  <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1.621 3.19a.807.807 0 011.108 0L6 6.271 9.27 3.19a.807.807 0 011.109 1.175L6 8.5 1.621 4.364a.807.807 0 010-1.174z"></path>
                </svg>
              </div>
            </div>
            <div className="currency-options">
              <button onClick={() => switchCurrency("USD")} className="currency-option" type="button">USD</button>
              <button onClick={() => switchCurrency("EUR")} className="currency-option" type="button">EUR</button>
            </div>
          </div>

        </div>

        <div className="tab-select">
          <TabList
            onChange={(selectedKey) => {
              console.log("Selected tab:", selectedKey);
              setActiveTab(selectedKey);
            }}
          >
            <Tab tabKey={1} tabName={"Tokens"} />
            <Tab tabKey={2} tabName={"NFTs"} />
            <Tab tabKey={3} tabName={"History"} />
          </TabList>

          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="chain-selector"
          >
            <option value="0x1">
              ETH
            </option>
            <option value="0x38">
              BSC
            </option>
          </select>
        </div>

        {/* Render the components conditionally, but don't unmount them when not active */}
        <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Tokens
            wallet={wallet}
            chain={chain}
            tokensData={tokensData}s
            setTokensData={setTokensData}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </div>

        <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Nfts
            wallet={wallet}
            chain={chain}
            nfts={nfts}
            setNfts={setNfts}
            filteredNfts={filteredNfts}
            setFilteredNfts={setFilteredNfts}
          />
        </div>

        <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
          <TransferHistory
            wallet={wallet}
            chain={chain}
            transfers={transfers}
            setTransfers={setTransfers}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
