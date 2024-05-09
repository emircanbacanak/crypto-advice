import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import FooterScreen from './FooterScreen';
import fetch from 'node-fetch';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [maxPriceDifference, setMaxPriceDifference] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setMaxPriceDifference(null); // Önbelleği temizle

      const kucoinResponse = await fetch('https://api.kucoin.com/api/v1/market/allTickers');
      const kucoinData = await kucoinResponse.json();
  
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
      const binanceData = await binanceResponse.json();

      const bybitResponse = await fetch(`https://api.bybit.com/v2/public/tickers`);
      const bybitData = await bybitResponse.json();

      const maxDifferencePair = findMaxPriceDifference(kucoinData.data.ticker, binanceData, bybitData.result);
      setMaxPriceDifference(maxDifferencePair);
  
      setLoading(false);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setLoading(false);
    }
  };

  const findMaxPriceDifference = (kucoinData, binanceData, bybitData) => {
    let maxDifference = null;
    let maxDifferencePair = null;

    const firstExchangeSymbols = kucoinData.map(item => item.symbol.replace('-USDT', ''));
    const secondExchangeSymbols = binanceData.map(item => item.symbol.replace('USDT', ''));
    let commonSymbols = firstExchangeSymbols.filter(symbol => secondExchangeSymbols.includes(symbol));
  
    let filterSymbols = ['UMA','XMR' ,'HNT','AERGO']; // İstenilmeyenler
  
    commonSymbols = commonSymbols.filter(symbol => !filterSymbols.includes(symbol));
  
    commonSymbols.forEach(symbol => {
      const kucoinItem = kucoinData.find(item => item.symbol === symbol + '-USDT');
      const binanceItem = binanceData.find(item => item.symbol === symbol + 'USDT');
      const bybitItem = bybitData.find(item => item.symbol === symbol + 'USDT');
  
      if (kucoinItem && binanceItem && bybitItem) {
        const kucoinPrice = parseFloat(kucoinItem.last);
        const binancePrice = parseFloat(binanceItem.price);
        const bybitPrice = parseFloat(bybitItem.last_price);
        const percentageDiffKB = calculatePercentageDifference(kucoinPrice, binancePrice);
        const percentageDiffBY = calculatePercentageDifference(binancePrice, bybitPrice);
        const percentageDiffYK = calculatePercentageDifference(bybitPrice, kucoinPrice);
        
        if (percentageDiffKB < 50 || percentageDiffBY < 50 || percentageDiffYK < 50) {
          const maxDiff = Math.max(percentageDiffKB, percentageDiffBY, percentageDiffYK);
          if (maxDiff > 50) {
            return;
          }
          
          if (maxDifference === null || maxDiff > maxDifference) {
            maxDifference = maxDiff;
            maxDifferencePair = {
              symbol: symbol,
              higherPriceExchange: kucoinPrice > binancePrice && kucoinPrice > bybitPrice ? 'Kucoin' : binancePrice > kucoinPrice && binancePrice > bybitPrice ? 'Binance' : 'Bybit',
              higherPrice: Math.max(kucoinPrice, binancePrice, bybitPrice),
              lowerPriceExchange: kucoinPrice < binancePrice && kucoinPrice < bybitPrice ? 'Kucoin' : binancePrice < kucoinPrice && binancePrice < bybitPrice ? 'Binance' : 'Bybit',
              lowerPrice: Math.min(kucoinPrice, binancePrice, bybitPrice),
              percentageDifference: maxDiff,
            };
          }
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

    return () => clearInterval(fetchDataInterval);
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
    <View style={styles.container}>
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
      <View style={styles.footer}>
        <FooterScreen />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 120,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default App;
