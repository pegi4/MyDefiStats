import React, { useState, useEffect } from 'react'
import ReactLoading from "react-loading";

function PortfolioValue({tokens, selectedCurrency}) {

    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {

        let val = 0;

        if(tokens && tokens.length > 0) {
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
            setTotalValue(val.toFixed(2));
        }

    }, [tokens, selectedCurrency])

    return (
    <div className='portfolio'>
        <h2>
            {totalValue === 0 ? <ReactLoading type="cylon" color="#687994" height={100} width={50} /> : (selectedCurrency === "USD" ? "$" : "€") + totalValue}
        </h2>
    </div>
    )
}

export default PortfolioValue;