import WalletInputs from './components/WalletInputs';
import Tokens from './components/Tokens';
import Porfolio from './components/PortfolioValue';
import TransferHistory from './components/TransferHistory';
import Nfts from './components/Nfts';
import TabList from './components/TabList';
import Tab from './components/Tab';

import './App.css';

import { useState, useEffect } from 'react';

import Blockie from 'react-blockies';

function App() {

  console.log('App rendered');

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
  const switchCurrency = (c) => {
    setSelectedCurrency(c);
    console.log("Switch currency to: ", selectedCurrency)
  };

  // function to get chain symbol
  const getChainSymbol = () => {
    if (chain === '0x1') {
      return 'ETH';
    } else if (chain === '0x38') {
      return 'BSC';
    }
    return ''; // Default case, handle other chains if needed
  };

  useEffect(() => {
    localStorage.setItem('wallet', wallet);
    console.log('Wallet changed!', wallet);
  }, [wallet]);
  
  useEffect(() => {
    localStorage.setItem('chain', chain);
    console.log('Chain changed!', chain);
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
            <div>
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
                wallet={wallet}
                chain={chain}
              />
            </div>
          </div>
          <div className="selector-dropdown">
            <div className="selector-selector">
              <div className="selector-text">{selectedCurrency}</div>
              <div className="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
                  <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1.621 3.19a.807.807 0 011.108 0L6 6.271 9.27 3.19a.807.807 0 011.109 1.175L6 8.5 1.621 4.364a.807.807 0 010-1.174z"></path>
                </svg>
              </div>
            </div>
            <div className="selector-options">
              <button onClick={() => switchCurrency("USD")} className="selector-option" type="button">USD</button>
              <button onClick={() => switchCurrency("EUR")} className="selector-option" type="button">EUR</button>
            </div>
          </div>

        </div>
        <div className="tab-select">
          <TabList onTabChange={(selectedKey) => {setActiveTab(selectedKey + 1); console.log("Selected tab:", selectedKey);}}>
              <Tab>Tokens</Tab>
              <Tab>NFTs</Tab>
              <Tab>History</Tab>
          </TabList>

          <div className="selector-dropdown">
            <div className="selector-selector">
              <div className="selector-text">{getChainSymbol()}</div>
              <div className="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
                  <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1.621 3.19a.807.807 0 011.108 0L6 6.271 9.27 3.19a.807.807 0 011.109 1.175L6 8.5 1.621 4.364a.807.807 0 010-1.174z"></path>
                </svg>
              </div>
            </div>
            <div className="selector-options">
              <button onClick={(e) => setChain(e.target.value)} value="0x1" className="selector-option" type="button">ETH</button>
              <button onClick={(e) => setChain(e.target.value)} value="0x38" className="selector-option" type="button">BSC</button>
            </div>
          </div>

        </div>

        {/* Render the components conditionally, but don't unmount them when not active */}
        <div style={{ display: activeTab === 1 ? 'block' : 'none' }} className={activeTab === 2 ? 'fade-in' : ''}>
          <Tokens
            wallet={wallet}
            chain={chain}
            tokensData={tokensData}s
            setTokensData={setTokensData}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </div>

        <div style={{ display: activeTab === 2 ? 'block' : 'none' }} className={activeTab === 2 ? 'fade-in' : ''}>
          <Nfts
            wallet={wallet}
            chain={chain}
            nfts={nfts}
            setNfts={setNfts}
            filteredNfts={filteredNfts}
            setFilteredNfts={setFilteredNfts}
          />
        </div>

        <div style={{ display: activeTab === 3 ? 'block' : 'none' }} className={activeTab === 2 ? 'fade-in' : ''}>
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
