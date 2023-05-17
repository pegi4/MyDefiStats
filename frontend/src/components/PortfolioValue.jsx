import React from 'react'
import { useState, useEffect } from 'react'

function PortfolioValue({nativeValue, tokens, selectedCurrency}) {

    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {

        let val = 0;

        for(let i = 0; i < tokens.length; i++) {
            if (selectedCurrency === "USD") {
                if (tokens[i].dVal !== 0) {
                    val += Number(tokens[i].dVal);
                }
            } else if (selectedCurrency === "EUR") {
                if (tokens[i].eVal !== 0) {
                    val += Number(tokens[i].eVal);
                }
            }
        }

        if (selectedCurrency === "USD") {
            val += Number(nativeValue.usd);
        } else if (selectedCurrency === "EUR") {
            val += Number(nativeValue.eur);
        }

        setTotalValue(val.toFixed(2));

    }, [nativeValue, tokens, selectedCurrency])

  return (
    <>
        <h2>
            Portfolio Total Value: {selectedCurrency === "USD" ? "$" : "€"} {totalValue}
        </h2>
    </>
  )
}

export default PortfolioValue
