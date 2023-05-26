import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Input from './Input';
import '../App.css';

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

    const nftProcessing = useCallback((t) => {
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
    }, [setNfts, setFilteredNfts]);

    const getUserNfts = useCallback(async () => {
        const response = await axios.get("http://localhost:5000/nftBalance", {
            params: {
                address: wallet,
                chain: chain,
            }
        });
    
        if (response.data.result) {
            nftProcessing(response.data.result);
        }
    
    }, [wallet, chain, nftProcessing]);
    
    useEffect(() => {
        if (wallet) {
            getUserNfts().catch((err) => {
                console.error(err);
            });
        }
    }, [wallet, chain, getUserNfts]);
    
    
    return (
    <>
        <div className='tabHeading'>
            NFT Portfolio
        </div>

        <div className='filters'>
            <Input 
                id="NameF"
                placeholder="Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
            />
            <Input 
                id="IdF"
                placeholder="ID"
                value={idFilter}
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