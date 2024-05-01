import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FooterScreen from './FooterScreen';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [maxPriceDifference, setMaxPriceDifference] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const kucoinResponse = await fetch('https://api.kucoin.com/api/v1/market/allTickers');
      const kucoinData = await kucoinResponse.json();
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
      const binanceData = await binanceResponse.json();

      const filteredKucoinData = kucoinData.data.ticker.filter(item =>
        item.symbol.endsWith('USDT') &&
        !item.symbol.endsWith('UP-USDT') &&
        !item.symbol.endsWith('DOWN-USDT') &&
        !item.symbol.endsWith('BTCUP-USDT') &&
        !item.symbol.endsWith('HNT-USDT')
      );

      const maxDifferencePair = findMaxPriceDifference(filteredKucoinData, binanceData);
      setMaxPriceDifference(maxDifferencePair);
      setLoading(false);
    } catch (error) {
      console.error('Veri alma hatası:', error);
      setLoading(false);
    }
  };

  const findMaxPriceDifference = (kucoinData, binanceData) => {
    let maxDifference = null;
    let maxDifferencePair = null;

    kucoinData.forEach(kucoinItem => {
      const binanceItem = binanceData.find(item => item.symbol === kucoinItem.symbol.replace('-USDT', 'USDT'));
      if (binanceItem) {
        const kucoinPrice = parseFloat(kucoinItem.last);
        const binancePrice = parseFloat(binanceItem.price);
        const percentageDiff = calculatePercentageDifference(kucoinPrice, binancePrice);
        if (maxDifference === null || percentageDiff > maxDifference) {
          maxDifference = percentageDiff;
          maxDifferencePair = {
            symbol: kucoinItem.symbol,
            higherPriceExchange: kucoinPrice > binancePrice ? 'Kucoin' : 'Binance',
            higherPrice: Math.max(kucoinPrice, binancePrice),
            lowerPriceExchange: kucoinPrice < binancePrice ? 'Kucoin' : 'Binance',
            lowerPrice: Math.min(kucoinPrice, binancePrice),
            percentageDifference: percentageDiff
          };
        }
      }
    });

    return maxDifferencePair;
  };

  const calculatePercentageDifference = (higherPrice, lowerPrice) => {
    return ((higherPrice - lowerPrice) / lowerPrice) * 100;
  };

  useEffect(() => {
    const fetchDataInterval = setInterval(fetchData, 10000);

    fetchData();

    return () => clearInterval(fetchDataInterval); // Temizleme işlemi
  }, []);

  return (
    <><View style={styles.container}>
      <Text style={styles.title}>En Yüksek Fiyat Farkı</Text>
      {loading ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : maxPriceDifference && maxPriceDifference.higherPrice && maxPriceDifference.lowerPrice && maxPriceDifference.percentageDifference ? (
        <>
          <View style={styles.card}>
            <Text style={styles.symbol}>{maxPriceDifference.symbol}</Text>
            <Text style={styles.price}>
              {maxPriceDifference.higherPriceExchange}: ${maxPriceDifference.higherPrice.toFixed(4)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.symbol}>{maxPriceDifference.symbol}</Text>
            <Text style={styles.price}>
              {maxPriceDifference.lowerPriceExchange}: ${maxPriceDifference.lowerPrice.toFixed(4)}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.price}>Yüzdelik Fark: %{maxPriceDifference.percentageDifference.toFixed(3)}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>Fiyat farkı bulunamadı.</Text>
      )}
    </View>
      <View>
        <FooterScreen />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    color: '#ffffff',
  },
  noDataText: {
    fontSize: 18,
    marginTop: 20,
    color: '#555',
  },
  card: {
    alignItems: 'center',
    width: '75%',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  symbol: {
    fontSize: 18,
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default App;