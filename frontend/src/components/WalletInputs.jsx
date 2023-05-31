import React, { useState, useEffect } from 'react';
import { utils } from 'web3';
import Autosuggest from 'react-autosuggest';
import Blockie from 'react-blockies';
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

function WalletInputs({ wallet, setWallet }) {
  
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  //const web3 = new Web3();
  const [session, setSession] = useState(null);

  // Wallet connection status
  const [walletConnected, setWalletConnected] = useState(false);

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
    <div className="suggestion-item">
      <Blockie className='rounded-2xl' seed={suggestion} size={10} scale={3} />
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
    if (walletConnected) {
      axios(`${process.env.REACT_APP_SERVER_URL}/authenticate`, {
        withCredentials: true,
      })
        .then(({ data }) => {
          setSession(data);
        })
        .catch((err) => {
          setSession(null);
        });
    }
  }, [walletConnected]);

  return (
    <div className='header'>
      <div className='title'>
        <Autosuggest
          className='autosuggest'
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
            setInputValue('');
          }}
        />
      </div>
      <div className='walletInputs'>
        <WagmiConfig config={config}>
          {session ? (
            <User
                session={session}
                onLogout={() => setSession(null)}
                setWallet={setWallet}
                walletConnected={walletConnected}
                setWalletConnected={setWalletConnected}
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