import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Input } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function Nfts({chain, wallet, nfts, setNfts, filteredNfts, setFilteredNfts}) {

    const [nameFilter, setNameFilter] = useState("");
    const [idFilter, setIdFilter] = useState("");

    useEffect(() => {
    
        if(idFilter.length === 0 && nameFilter.length === 0) {
            return setFilteredNfts(nfts);
        }

        let fiNfts = []

        for(let i = 0; i < nfts.length; i++) {
            if 
            (
             nfts[i].name.includes(nameFilter) && 
             idFilter.length === 0
            ) {
                fiNfts.push(nfts[i]);
            } else if (
                nfts[i].token_id.includes(idFilter) &&
                nameFilter.length === 0
            ) {
                fiNfts.push(nfts[i]);
            } else if (
                nfts[i].name.includes(nameFilter) &&
                nfts[i].token_id.includes(idFilter)
            ) {
                fiNfts.push(nfts[i]);
            }
        }

        setFilteredNfts(fiNfts);

    }, [nameFilter, idFilter, setFilteredNfts, nfts])

    async function getUserNfts() {
        const response = await axios.get("http://localhost:5000/nftBalance", {
            params: {
                address: wallet,
                chain: chain,
            }
        });

        if (response.data.result) {
            nftProcessing(response.data.result);
        }

    }

    function nftProcessing(t) {
        for(let i = 0; i < t.length; i++) {

            let meta = JSON.parse(t[i].metadata);
            if(meta && meta.image) {
                if(meta.image.includes(".")) {
                    t[i].image = meta.image;
                } else {
                    t[i].image = "https://ipfs.moralis.io:2053/ipfs/" + meta.image;
                }
            }

        }
        setNfts(t);
        setFilteredNfts(t);
    }

  return (
    <>
        <div className='tabHeading'>
            NFT Portfolio <Reload onClick={getUserNfts} />
        </div>

        <div className='filters'>
            <Input 
                id="NameF"
                label="Name Filter"
                labelBgColor="rgb(33, 33, 38)"
                value={nameFilter}
                style={{}}
                onChange={(e) => setNameFilter(e.target.value)}
            />
            <Input 
                id="IdF"
                label="Id Filter"
                labelBgColor="rgb(33, 33, 38)"
                value={idFilter}
                style={{}}
                onChange={(e) => setIdFilter(e.target.value)}
            />
        </div>
        <div className='nftList'>
                {filteredNfts.length > 0 && filteredNfts.map((e) => {
                    return (
                        <>
                            <div className='nftInfo'>
                                {e.image && <img src={e.image} width={200} alt={e.name} />}
                                <div>Name: {e.name}, </div>
                                <div>ID: {e.token_id.slice(0,5)}</div>
                            </div>
                        </>
                    )
                })}
            </div>
    </>
  )
}

export default Nfts

/*   return (
    <>
        <h1>Porfolio NFTs</h1>
        <div>

            <button onClick={getUserNfts}>Get NFTs</button>
            <span> Name Filter </span>
              <input
                onChange={(e) => setNameFilter(e.target.value)}
                value={nameFilter}
               />

            <span> Id Filter </span>
              <input
                onChange={(e) => setIdFilter(e.target.value)}
                value={idFilter}
               />
               
            <br />
            {filteredNfts.length > 0 && filteredNfts.map((e) => {
                return (
                    <>
                    <span>Name: {e.name}, </span>
                    <span>(ID: {e.token_id})</span>
                    {e.image && <img src={e.image} alt={e.name} width={200} />}
                    <br />
                    </>
                )
            })}
        </div>
    </>
  ) */