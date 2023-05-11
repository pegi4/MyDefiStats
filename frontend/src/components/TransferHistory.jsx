import React from 'react'
import axios from 'axios'
import { Table } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function TransferHistory({chain, wallet, transfers, setTransfers}) {
    
    async function getTokenTransfers() {

        const response = await axios.get("http://localhost:5000/tokenTransfers", {
            params: {
                address: wallet,
                chain: chain,
            },
        });

        if (response.data) {
            setTransfers(response.data);
        }

    }
  
    return (
    <>
        <div className="tabHeading"> Transfer History  <Reload onClick={getTokenTransfers} /> </div>
        <div>
        {transfers.length > 0 && (
            <Table
                pageSize={8}
                noPagination={true}
                style={{ width: 'auto' }}
                columnsConfig='auto auto auto auto auto'
                data={transfers.map((e) => [
                    e.symbol,
                    (Number(e.value) / Number(`1e${e.decimals}`)).toFixed(3),
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
        )}
        </div>
    </>
  )
}

export default TransferHistory;

/* return (
    <>
        <h1>Transfer History</h1>
        <div>
            <button onClick={getTokenTransfers}>Fetch Transfers</button>
            <table>
                <tr>
                    <th>Token</th>
                    <th>Amount</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                </tr>
                {transfers.length > 0 && transfers.map((e) => {
                    return (
                        <tr key={e.hash}>
                            <td>{e.symbol}</td>
                            <td>{(Number(e.value) / Number(`1e${e.decimals}`)).toFixed(3)}</td>
                            <td>{e.from_address}</td>
                            <td>{e.to_address}</td>
                            <td>{e.block_timestamp}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    </>
  ) */