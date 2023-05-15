import './App.css';
import { useState, useEffect } from 'react';
import WalletInputs from './components/WalletInputs';
import NativeTokens from './components/NativeTokens';
import Tokens from './components/Tokens';
import Porfolio from './components/PortfolioValue';
import TransferHistory from './components/TransferHistory';
import Nfts from './components/Nfts';
import { TabList, Tab } from '@web3uikit/core';
import { Blockie } from '@web3uikit/web3';

function App() {

  const [wallet, setWallet] = useState(localStorage.getItem('wallet') || "");
  const [chain, setChain] = useState(localStorage.getItem('chain') || "0x1");  
  const [nativeBalance, setNativeBalance] = useState(0);
  const [nativeValue, setNativeValue] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [tokens, setTokens] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

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
        </div>

        <Porfolio
          nativeValue={nativeValue}
          tokens={tokens}
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
        </TabList>


        {/* Render the components conditionally, but don't unmount them when not active */}
        <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <NativeTokens
            wallet={wallet}
            chain={chain}
            nativeBalance={nativeBalance}
            setNativeBalance={setNativeBalance}
            nativeValue={nativeValue}
            setNativeValue={setNativeValue}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
          <Tokens
            wallet={wallet}
            chain={chain}
            tokens={tokens}
            setTokens={setTokens}
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
