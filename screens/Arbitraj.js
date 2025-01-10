import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, FlatList } from 'react-native';
import fetch from 'node-fetch';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmail } from '../companents/actions/userActions';
import store from '../companents/store';
import { Provider } from 'react-redux';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [maxPriceDifference, setMaxPriceDifference] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [calculatedAmount, setCalculatedAmount] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [percentageDifference, setPercentageDifference] = useState('');
  const [alarms, setAlarms] = useState([]);

  const dispatch = useDispatch();
  const userEmail = useSelector(state => state.user.userEmail);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchDataInterval = setInterval(fetchData, 30000);
    fetchData();
    loadUserEmail();
    loadAlarms();
    return () => clearInterval(fetchDataInterval);
  }, []);

  useEffect(() => {
    if (loading) {
      setCalculatedAmount(null);
    }
  }, [loading]);

  const loadUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        dispatch(setUserEmail(email));
      }
    } catch (error) {
      console.error('Could not receive email:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setMaxPriceDifference(null);

      const kucoinResponse = await fetch('https://api.kucoin.com/api/v1/market/allTickers');
      const kucoinData = await kucoinResponse.json();

      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
      const binanceData = await binanceResponse.json();

      const maxDifferencePair = findMaxPriceDifference(kucoinData.data.ticker, binanceData);
      setMaxPriceDifference(maxDifferencePair);

      setLoading(false);
    } catch (error) {
      console.error('Data extraction error:', error);
      setLoading(false);
    }
  };

  const findMaxPriceDifference = (kucoinData, binanceData) => {
    let maxDifference = null;
    let maxDifferencePair = null;

    const firstExchangeSymbols = kucoinData.map(item => item.symbol.replace('-USDT', ''));
    const secondExchangeSymbols = binanceData.map(item => item.symbol.replace('USDT', ''));
    let commonSymbols = firstExchangeSymbols.filter(symbol => secondExchangeSymbols.includes(symbol));

    let filterSymbols = ["ETHDOWN","ETHUP","UNFI","LOOM","REEF","REN","KEY","OMG","HNT"];

    commonSymbols = commonSymbols.filter(symbol => !filterSymbols.includes(symbol));

    commonSymbols.forEach(symbol => {
      const kucoinItem = kucoinData.find(item => item.symbol === symbol + '-USDT');
      const binanceItem = binanceData.find(item => item.symbol === symbol + 'USDT');

      if (kucoinItem && binanceItem) {
        const kucoinPrice = parseFloat(kucoinItem.last);
        const binancePrice = parseFloat(binanceItem.price);
        const percentageDiffKB = calculatePercentageDifference(kucoinPrice, binancePrice);

        if (percentageDiffKB < 50) {
          const maxDiff = percentageDiffKB;
          if (maxDifference === null || maxDiff > maxDifference) {
            maxDifference = maxDiff;
            maxDifferencePair = {
              symbol: symbol,
              higherPriceExchange: kucoinPrice > binancePrice ? 'Kucoin' : 'Binance',
              higherPrice: Math.max(kucoinPrice, binancePrice),
              lowerPriceExchange: kucoinPrice < binancePrice ? 'Kucoin' : 'Binance',
              lowerPrice: Math.min(kucoinPrice, binancePrice),
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

  const loadAlarms = async () => {
    try {
      if (userEmail) {
        const storedAlarms = await AsyncStorage.getItem(`alarms_${userEmail}`);
        if (storedAlarms) {
          setAlarms(JSON.parse(storedAlarms));
        }
      }
    } catch (error) {
      console.error('Failed to load alarms:', error);
    }
  };

  const saveAlarms = async (newAlarms) => {
    try {
      if (userEmail) {
        await AsyncStorage.setItem(`alarms_${userEmail}`, JSON.stringify(newAlarms));
      }
    } catch (error) {
      console.error('Alarms could not be recorded:', error);
    }
  };

  const handleSave = () => {
    if (percentageDifference) {
      const newAlarms = [...alarms, { id: Date.now().toString(), percentage: percentageDifference }];
      setAlarms(newAlarms);
      saveAlarms(newAlarms);
      setPercentageDifference('');
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setPercentageDifference('');
    setModalVisible(false);
  };

  const calculateTransaction = () => {
    if (!transactionAmount || !maxPriceDifference) return;

    const amount = parseFloat(transactionAmount);
    const commissionRate = 0.002;
    const transferFee = 0.0;

    const higherPrice = maxPriceDifference.higherPrice;
    const lowerPrice = maxPriceDifference.lowerPrice;

    const grossProfit = amount * ((higherPrice - lowerPrice) / lowerPrice);
    const commission = amount * commissionRate;
    const netProfit = grossProfit - commission - transferFee;

    setCalculatedAmount(netProfit.toFixed(2));
  };

  const handleDelete = async (id) => {
    const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
    setAlarms(updatedAlarms);
    saveAlarms(updatedAlarms);
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.notificationIcon} onPress={toggleModal}>
          <Icon name="notifications" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Icon name="close" size={25} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Enter Percentage Difference</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={percentageDifference}
                onChangeText={text => setPercentageDifference(text)}
                placeholder="Percentage Difference"
                placeholderTextColor="#aaaaaa"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.title}>Highest Price Difference</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : maxPriceDifference && maxPriceDifference.higherPrice && maxPriceDifference.lowerPrice && maxPriceDifference.percentageDifference ? (
          <>
            <View style={styles.card}>
              <Text style={styles.symbol}>{maxPriceDifference.symbol}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.exchangeName}>{maxPriceDifference.higherPriceExchange}</Text>
                <Text style={styles.price}>{maxPriceDifference.higherPrice} USDT</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.exchangeName}>{maxPriceDifference.lowerPriceExchange}</Text>
                <Text style={styles.price}>{maxPriceDifference.lowerPrice} USDT</Text>
              </View>
              <Text style={styles.percentage}>{maxPriceDifference.percentageDifference.toFixed(2)}%</Text>
            </View>
            <View style={styles.transactionContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={transactionAmount}
                onChangeText={setTransactionAmount}
                placeholder="Transaction Amount"
                placeholderTextColor="#aaaaaa"
              />
              <TouchableOpacity style={styles.calculateButton} onPress={calculateTransaction}>
                <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
            </View>
            {calculatedAmount !== null && (
              <Text style={styles.calculatedAmount}>Earning: {calculatedAmount} USDT</Text>
            )}
          </>
        ) : (
          <Text style={styles.noDataText}>No data found</Text>
        )}

        <View style={styles.alarmsContainer}>
          <Text style={styles.alarmsTitle}>Alarm List</Text>
          {alarms.length === 0 ? (
            <Text style={styles.noAlarmsText}>No alarms</Text>
          ) : (
            <FlatList
              data={alarms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.alarmItem}>
                  <Text style={styles.alarmText}>{item.percentage}%</Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Icon name="trash" size={25} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ flexGrow: 1 }}
            />
          )}
        </View>
      </View>
    </Provider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 40,
  },
  alarmsContainer: {
    paddingTop: 20,
    flex: 0.93,
    justifyContent: 'flex-end',
    position: 'static',
  },
  notificationIcon: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  symbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  exchangeName: {
    fontSize: 18,
    color: '#aaaaaa',
  },
  price: {
    fontSize: 18,
    color: '#ffffff',
  },
  percentage: {
    fontSize: 20,
    color: '#4caf50',
    marginTop: 10,
    alignSelf: 'center',
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    color: '#ffffff',
  },
  calculateButton: {
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    height: 45,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  calculatedAmount: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000000',
  },
  modalContent: {
    marginBottom: 100,
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: '#444444',
    borderRadius: 10,
    padding: 10,
    color: '#ffffff',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },

  alarmsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  noAlarmsText: {
    color: '#aaaaaa',
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#444444',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  alarmText: {
    color: '#ffffff',
  },
  noDataText: {
    color: '#aaaaaa',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
