import React, { useEffect, useState } from 'react';

export const useBinanceData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://api.binance.com/api/v3/ticker/price')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            const usdtPairs = data
              .filter(item => item.symbol.endsWith('USDT'))
              .map(item => ({
                symbol: item.symbol.replace('USDT', ''),
                price: parseFloat(item.price).toFixed(4).toString().replace(/(\.\d*?[1-9])0+$/, '$1'), // Sadece 0 olmayan basamakları göster
              }));
            setData(usdtPairs);
          }
        })
        .catch((error) => console.error(error));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useBinanceData;
