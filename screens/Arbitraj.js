import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import FooterScreen from './FooterScreen';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [maxPriceDifference, setMaxPriceDifference] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setMaxPriceDifference(null); // Clear cache

      const kucoinResponse = await fetch('https://api.kucoin.com/api/v1/market/allTickers');
      const kucoinData = await kucoinResponse.json();
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
      const binanceData = await binanceResponse.json();

      const filteredKucoinData = kucoinData.data.ticker.filter(item =>
        item.symbol.endsWith('USDT') &&
        !item.symbol.endsWith('UP-USDT') &&
        !item.symbol.endsWith('DOWN-USDT') &&
        !item.symbol.endsWith('BTCUP-USDT') &&
        !item.symbol.endsWith('BULL-USDT') &&
        !item.symbol.endsWith('BIFI-USDT') &&
        !item.symbol.endsWith('BTT-USDT') &&
        !item.symbol.endsWith('AI-USDT') &&
        !item.symbol.endsWith('ACE-USDT') &&
        !item.symbol.endsWith('MC-USDT') &&
        !item.symbol.endsWith('ALT-USDT') &&
        !item.symbol.endsWith('HNT-USDT')
      );

      const maxDifferencePair = findMaxPriceDifference(filteredKucoinData, binanceData);
      setMaxPriceDifference(maxDifferencePair);
      setLoading(false);
    } catch (error) {
      console.error('Data fetching error:', error);
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
            percentageDifference: percentageDiff,
          };
        }
      }
    });

    return maxDifferencePair;
  };

  const calculatePercentageDifference = (higherPrice, lowerPrice) => {
    const percentageDifference = ((higherPrice - lowerPrice) / lowerPrice) * 100;
    return Math.abs(percentageDifference);
  };

  useEffect(() => {
    const fetchDataInterval = setInterval(fetchData, 30000);

    fetchData();

    return () => clearInterval(fetchDataInterval); // Cleanup
  }, []);

  const handleCalculate = () => {
    const amount = parseFloat(transactionAmount);
    if (!isNaN(amount) && maxPriceDifference && maxPriceDifference.percentageDifference) {
      const calculated = (amount * maxPriceDifference.percentageDifference) / 100;
      setCalculatedAmount(calculated.toFixed(2));
    } else {
      setCalculatedAmount(null);
    }
  };

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
          <View style={styles.transactionBox}>
            <Text style={styles.transactionText}>Kaç USDT işlem yapacaksınız?</Text>
            <TextInput
              style={styles.transactionInput}
              keyboardType="numeric"
              value={transactionAmount}
              onChangeText={text => setTransactionAmount(text)} />
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.buttonText}>Hesapla</Text>
            </TouchableOpacity>
            {calculatedAmount !== null && (
              <Text style={styles.calculatedText}>Kazanılabilecek tutar: ${calculatedAmount}</Text>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>Fiyat farkı bulunamadı</Text>
      )}

    </View>
      <View style={styles.footer}>
        <FooterScreen />
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 730,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom:120,
  },
  title: {
    fontSize: 26,
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
  transactionBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#ffffff',
  },
  transactionInput: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    width: 100,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  calculatedText: {
    marginTop: 10,
    fontSize: 18,
    color: '#ffffff',
  },
});

export default App;