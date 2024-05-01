import React, { useEffect, useState } from 'react';

export const useBtcTurkData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://api.btcturk.com/api/v2/ticker')
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data)) {
            const usdtPairs = data
              .filter(item => item.pair.endsWith('USDT')) // USDT ile biten çiftler
              .map(item => ({
                symbol: item.pair.replace('USDT', ''),
                price: parseFloat(item.last).toFixed(4).toString().replace(/(\.\d*?[1-9])0+$/, '$1')
              }));
            setData(usdtPairs);
          }
        })
        .catch(error => console.error(error));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useBtcTurkData;
