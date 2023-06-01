import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import "./TransferHistory.css";

function TransferHistory({ chain, wallet, transfers, setTransfers }) {
  const [isLoading, setIsLoading] = useState(true);

  const formatBalance = (balance) => {
    if (balance === 0) {
      return '0';
    } else if (balance < 0.01 && balance > 0) {
      let precision = Math.ceil(Math.abs(Math.log10(balance))) + 1;
      return balance.toFixed(precision);
    }
  
    // Check if the decimal part is zero
    const decimalPart = balance - Math.floor(balance);
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPart === 0 ? 0 : 2, // if decimal part = 0 then min 0 fraction digits otherwise 2
      maximumFractionDigits: decimalPart === 0 ? 0 : 2, // if decimal part = 0 then max 0 fraction digits otherwise 2
    });
    
    return formatter.format(balance);
  };  

  const getTokenTransfers = useCallback(async () => {
    setIsLoading(true);

    const response = await axios.get("http://localhost:5000/tokenTransfers", {
      params: {
        address: wallet,
        chain: chain,
      },
    });

    if (response.data) {
      setTransfers(response.data);
    }

    setIsLoading(false);
  }, [wallet, chain, setTransfers]);

  useEffect(() => {
    if (wallet) {
      getTokenTransfers().catch((err) => {
        console.error(err);
      });
    }
  }, [wallet, chain, getTokenTransfers]);

  const groupedTransfers = transfers.reduce((acc, transfer) => {
    const date = transfer.block_timestamp.slice(0, 10);

    const existingDateIndex = acc.findIndex((group) => group.date === date);

    if (existingDateIndex !== -1) {
      acc[existingDateIndex].transfers.push(transfer);
    } else {
      acc.push({
        date,
        transfers: [transfer],
      });
    }

    return acc;
  }, []);


  const getTransactionUrl = (transactionHash) => {
    if (chain === "0x38") {
      return `https://bscscan.com/tx/${transactionHash}`;
    } else if (chain === "0x1") {
      return `https://etherscan.io/tx/${transactionHash}`;
    }
    // Add more conditions for other chains if needed
    return "";
  };

  return (
    <>
      <div className="transactions-container">
        {isLoading ? (
          <ReactLoading type="cylon" color="#687994" height={100} width={50} />
        ) : (
          groupedTransfers.map((group) => (
            <div className="transaction-group" key={group.date}>
              <div className="date-header">{group.date}</div>
              {group.transfers.map((transfer, index) => {
                const transactionUrl = getTransactionUrl(transfer.transaction_hash);
                return (
                  <a
                    href={transactionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transaction"
                    key={`${transfer.transaction_hash}-${index}`}
                  >
                    <div className="transaction-type">
                    {transfer.from_address.toLowerCase() === wallet.toLowerCase() ? "Sent" : "Received"}
                    </div>
                    <div className="token-amount">
                      {transfer.symbol}:{" "}
                      {formatBalance(
                        Number(transfer.value) /
                        Number(`1e${transfer.decimals}`)
                      )}
                    </div>
                    <div className="address">
                    {transfer.from_address.toLowerCase() === wallet.toLowerCase()
                        ? `To: ${transfer.to_address}`
                        : `From: ${transfer.from_address}`}
                    </div>
                  </a>
                );
              })}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default TransferHistory;
