const Moralis = require('moralis').default;
const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')
const port = 5000
//excess to .env file
require('dotenv').config()

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

// Fetch Native Balance
app.get('/nativeBalance', async (req, res) => {

  //await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  try{

    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address: address,
      chain: chain,
    });

    const nativeBalance = response.result;

    //Wrapped Native currencies addresses
    let nativeCurrency;

    if(chain === '0x38'){
      nativeCurrency = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    } else if(chain === '0x89'){
      nativeCurrency = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    } else if(chain === '0x1'){
      nativeCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    }

    const nativePrice = await Moralis.EvmApi.token.getTokenPrice({
      address: nativeCurrency, // Wrapped Contract
      chain: chain,
    });

    console.log('nativePrice:', nativePrice);

    nativeBalance.symbol = nativePrice.jsonResponse.nativePrice.symbol;

    nativeBalance.usd = nativePrice.jsonResponse.usdPrice;

    // USD to EUR
    nativeBalance.eur = nativeBalance.usd * (await axios.get(`https://open.er-api.com/v6/latest/USD?apiKey=${process.env.EXCHANGE_RATES_API_KEY}`)).data.rates.EUR;

    console.log('nativeBalance:', nativeBalance);

    res.send(nativeBalance)

  }catch(error){
    console.log(error)
  }

})

// Fetch Token Price
const exchanges = ["pancakeswap-v2", "sushiswap-v2", "uniswap-v3", "quickswap"];

async function getTokenPrice(contract_address, chain) {
  for (let exchange of exchanges) {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: contract_address,
        chain: chain,
        exchange: exchange,
      });

      if (response && response.jsonResponse && response.jsonResponse.usdPrice) {
        // Valid Price
        return response.jsonResponse.usdPrice;
      }

    } catch (error) {
      console.error(`Error fetching price from ${exchange} `);
    }
  }

  // Don't get a price from any exchange
  return null;
} 

// Fetch Token Balance
app.get('/tokenBalances', async (req, res) => {
    try {
      const { address, chain } = req.query;
  
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address: address,
        chain: chain,
      });
  
      let tokens = response.jsonResponse;
  
      let legitTokens = [];

      let spamTokens = [];
  
      for (let i = 0; i < tokens.length; i++) {
        // Call getTokenPrice for each token
        const price = await getTokenPrice(tokens[i].token_address, chain);

        if(price) {
          tokens[i].usd = price;
          
          tokens[i].eur = tokens[i].usd * (await axios.get(`https://open.er-api.com/v6/latest/USD?apiKey=${process.env.EXCHANGE_RATES_API_KEY}`)).data.rates.EUR;
        }
  
        if (price && !tokens[i].possible_spam) {
          legitTokens.push(tokens[i]);
        } else {
          spamTokens.push(tokens[i]);
          console.log("Poo coin");
        }
      }
  
      res.send({
        all: tokens,
        legit: legitTokens,
        spam: spamTokens
      });
      console.log("All Tokens: ", tokens);
      console.log("Legit Tokens: ", legitTokens);
      console.log("Spam Tokens: ", spamTokens);
  
    } catch (error) {
      console.log(error);
    }
});


// Transactions
app.get('/tokenTransfers', async (req, res) => {

  try {

    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address: address,
      chain: chain,
    });

    
    const userTrans = response.jsonResponse;

    //console.log(userTrans.result.address);
    //res.send(userTrans.result);
    
    let userTransDetails = [];

    for (let i = 0; i < userTrans.result.length; i++) {

      const metaResponse = await Moralis.EvmApi.token.getTokenMetadata({
        addresses: [userTrans.result[i].address],
        chain: chain,
      });

      //console.log(`Token address: ${userTrans.result[i].address}`);
      //console.log(metaResponse);

      if(metaResponse.jsonResponse) {
        userTrans.result[i].decimals = metaResponse.jsonResponse[0].decimals;
        userTrans.result[i].symbol = metaResponse.jsonResponse[0].symbol;
        userTransDetails.push(userTrans.result[i]);
      } else {
        console.log("No details for coin");
      }
    } 

    console.log(userTransDetails);
    res.send(userTransDetails);

  } catch (error) {
    console.log(error);
  }
});


// NFT Balance
app.get('/nftBalance', async (req, res) => {
  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: chain,
    });

    const nfts = response.jsonResponse;
    res.send(nfts);

  } catch (error) {
    console.log(error);
  }
});