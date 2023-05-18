import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Table } from '@web3uikit/core';
import ReactLoading from "react-loading";

function TransferHistory({chain, wallet, transfers, setTransfers}) {
    
    // Add a new piece of state here
    const [isLoading, setIsLoading] = useState(true);

    const getTokenTransfers = useCallback(async () => {
        setIsLoading(true); // Set loading to true when the function is called

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
        if(wallet){
            getTokenTransfers().catch((err) => {
                console.error(err);
            });
        }
    }, [wallet, chain, getTokenTransfers]);
  
    return (
        <>
            <div className="tabHeading"> Transfer History </div>
            <div>
            {isLoading ? (
                <ReactLoading type="cylon" color="#687994"
                    height={100} width={50} /> 
            ) : transfers.length > 0 ? (
                <Table
                    pageSize={8}
                    noPagination={true}
                    style={{ width: 'auto' }}
                    columnsConfig='auto auto auto auto auto'
                    data={transfers.map((e) => [
                        e.symbol,
                        (Number(e.value) / Number(`1e${e.decimals}`)).toFixed(2),
                        `${e.from_address.slice(0,4)}...${e.from_address.slice(38)}`,
                        `${e.to_address.slice(0,4)}...${e.to_address.slice(38)}`,
                        e.block_timestamp.slice(0,10),
                    ])}
                    header={[
                        <span>Token</span>,
                        <span>Amount</span>,
                        <span>From</span>,
                        <span>To</span>,
                        <span>Date</span>,
                    ]}
                />
            ) : null}
            </div>
        </>
    )
}

export default TransferHistory;
