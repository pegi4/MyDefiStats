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

// EUR TO USD Function


app.get('/nativeBalance', async (req, res) => {

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  try{

    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address: address,
      chain: chain,
    });

    const nativeBalance = response.result;

    let nativeCurrency;

    if(chain === '0x38'){
      nativeCurrency = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    } else if(chain === '0x89'){
      nativeCurrency = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    }

    const nativePrice = await Moralis.EvmApi.token.getTokenPrice({
      address: nativeCurrency, // Wrapped Contract
      chain: chain,
    });

    console.log('nativePrice:', nativePrice);

    nativeBalance.usd = nativePrice.jsonResponse.usdPrice;

    // Get USD to EUR conversion rate
    const exchangeRatesApiKey = 'dJROSHmFBuhNHmQnTYuALyFGuyJJAWpS';
    const exchangeRatesApiUrl = `https://open.er-api.com/v6/latest/USD?apiKey=${exchangeRatesApiKey}`;
    const exchangeRatesResponse = await axios.get(exchangeRatesApiUrl);
    const usdToEurRate = exchangeRatesResponse.data.rates.EUR;

    // Convert USD balance to EUR
    nativeBalance.eur = nativeBalance.usd * usdToEurRate;

    res.send(nativeBalance)

  }catch(error){
    console.log(error)
  }

})