import React, { useState, useEffect } from 'react';
import { utils } from 'web3';
import Autosuggest from 'react-autosuggest';
import { Select, CryptoLogos } from '@web3uikit/core';
import { Blockie } from '@web3uikit/web3';
import { configureChains, WagmiConfig, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet } from 'wagmi/chains';
import axios from 'axios';

import "../App.css";
import Signin from './Signin';
import User from './User';

const {
  publicClient,
  webSocketPublicClient
} = configureChains([mainnet], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient
});

function WalletInputs({ chain, setChain, wallet, setWallet }) {
  
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  //const web3 = new Web3();
  const [session, setSession] = useState(null);

  const isValidWalletAddress = (value) => {
    return utils.isAddress(value);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (isValidWalletAddress(value)) {
      setSuggestions([value]);
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => (
    <div>
      <Blockie seed={suggestion} size={10} scale={3} />
      <span>{suggestion}</span>
    </div>
  );

  const inputProps = {
    placeholder: 'Wallet Address',
    value: inputValue,
    onChange: (_, { newValue }) => {
      setInputValue(newValue);
    },
  };

  // Check if user is authenticated when the app loads
  useEffect(() => {
    axios(`${process.env.REACT_APP_SERVER_URL}/authenticate`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        setSession(data);
      })
      .catch((err) => {
        setSession(null);
      });
  }, []);

  return (
    <div className='header'>
      <div className='title'>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={(_, { suggestion }) => {
            if (wallet !== suggestion) {
              setWallet(suggestion);
            }
            setInputValue('');  // clear the input
          }}
        />
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
      </div>
      <div className='walletInputs'>
        <WagmiConfig config={config}>
          {session ? (
            <User
                session={session}
                onLogout={() => setSession(null)}
                setWallet={setWallet}
            />
          ) : (
            <Signin onLogin={setSession} />
          )}
        </WagmiConfig>
      </div>
    </div>
  );

}


export default WalletInputs