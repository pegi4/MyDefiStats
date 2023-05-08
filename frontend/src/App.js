import './App.css';
import { useState } from 'react';
import WalletInputs from './components/WalletInputs';
import NativeTokens from './components/NativeTokens';
import Tokens from './components/Tokens';
import Porfolio from './components/PortfolioValue';

function App() {

  const [wallet, setWallet] = useState("");
  const [chain, setChain] = useState("0x1");
  const [nativeBalance, setNativeBalance] = useState(0);
  const  [nativeValue, setNativeValue] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [tokens, setTokens] = useState([]);

  return (
    <div className="App">
      <WalletInputs
        chain={chain}
        setChain={setChain}
        wallet={wallet}
        setWallet={setWallet}
      />
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
      <Porfolio
        nativeValue={nativeValue}
        tokens={tokens}
      />
    </div>
  );
}

export default App;
