import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import "./TransferHistory.css";

function TransferHistory({ chain, wallet, transfers, setTransfers }) {
  const [isLoading, setIsLoading] = useState(true);

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


  return (
    <>
      <div className="transactions-container">
        {isLoading ? (
          <ReactLoading type="cylon" color="#687994" height={100} width={50} />
        ) : (
          groupedTransfers.map((group) => (
            <div className="transaction-group" key={group.date}>
              <div className="date-header">{group.date}</div>
              {group.transfers.map((transfer) => {
                return (
                  <div className="transaction" key={transfer.transaction_hash}>
                    <div className="transaction-type">
                    {transfer.from_address.toLowerCase() === wallet.toLowerCase() ? "Sent" : "Received"}
                    </div>
                    <div className="token-amount">
                      {transfer.symbol}:{" "}
                      {(
                        Number(transfer.value) /
                        Number(`1e${transfer.decimals}`)
                      ).toFixed(2)}
                    </div>
                    <div className="address">
                    {transfer.from_address.toLowerCase() === wallet.toLowerCase()
                        ? `To: ${transfer.to_address}`
                        : `From: ${transfer.from_address}`}
                    </div>
                  </div>
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
