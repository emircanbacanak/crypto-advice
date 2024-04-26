import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FooterScreen from './FooterScreen';
import { useBinanceData } from '../companents/BinanceData';

const Arbitraj = () => {
  const data = useBinanceData();

  useFocusEffect(
    React.useCallback(() => {
      let intervalId;

      if (data.length > 0) {
        intervalId = setInterval(() => useBinanceData(), 20000);
      }

      return () => clearInterval(intervalId);
    }, [data])
  );

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView >
          <ScrollView contentContainerStyle={styles.sc}>
            {data.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.text}>{item.symbol}: ${item.price}</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>

      <View>
        <FooterScreen />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '94%',
    backgroundColor: '#000000',
    width: '100%',
  },
  sc: {
    alignItems: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#C7C7C7',
    borderRadius: 10,
    width: '85%',
    height: 70,
  },
  text: {
    fontSize: 18,
  },
});

export default Arbitraj;
