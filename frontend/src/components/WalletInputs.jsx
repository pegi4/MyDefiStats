import React, { useState } from 'react';
import { utils } from 'web3';
import Autosuggest from 'react-autosuggest';
import { Select, CryptoLogos } from '@web3uikit/core';
import { Blockie } from '@web3uikit/web3';
import "../App.css";

function WalletInputs({ chain, setChain, wallet, setWallet }) {
  
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  //const web3 = new Web3();

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
    placeholder: '0x...',
    value: inputValue,
    onChange: (_, { newValue }) => {
      setInputValue(newValue);
    },
  };

  return (
    <div className='header'>
      <div className='walletInputs'>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={(_, { suggestion }) => {
            setWallet(suggestion);
            setInputValue('');  // clear the input
          }}
        />
        <Select
          defaultOptionIndex={chain === "0x1" ? 0 : 1}
          id="Chain"
          onChange={(e) => setChain(e.value)}
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
    </div>
  );

}


export default WalletInputs