import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { LineChart } from "react-native-chart-kit";

const fetchChartData = async (symbol, setChartData, setErrorMessage) => {
  try {
    setChartData(null);
    setErrorMessage('');

    const today = new Date();
    const endDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    today.setDate(today.getDate() - 7);
    const startDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&startTime=${Date.parse(startDate)}&endTime=${Date.parse(endDate)}`);
    const data = await response.json();

    if (data.code === -1121) {
      setErrorMessage('Veri yok');
      return;
    }

    const prices = data.map(item => {
      const date = new Date(item[0]);
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return [day, parseFloat(item[4])];
    });
    setChartData({ prices });

  } catch (error) {
    console.error("Veri alınırken bir hata oluştu:", error);
    setErrorMessage('Bir hata oluştu');
  }
};

const fetchCurrentPrice = async (symbol, setCurrentPrice) => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await response.json();
    setCurrentPrice(parseFloat(data.price));
  } catch (error) {
    console.error("Geçerli fiyat alınırken bir hata oluştu:", error);
  }
};

const Item = React.memo(({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [symbolImage, setSymbolImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`);
        setSymbolImage(response.url);

        await fetchChartData(item.symbol.toUpperCase(), setChartData, setErrorMessage);
      } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
        setErrorMessage('Bir hata oluştu');
      }
    };

    fetchData();

    return () => { };
  }, [item]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        await fetchCurrentPrice(item.symbol.toUpperCase(), setCurrentPrice);
      } catch (error) {
        console.error("Geçerli fiyat alınırken bir hata oluştu:", error);
      }
    };

    fetchPrice();

    const priceInterval = setInterval(fetchPrice, 30000);

    return () => clearInterval(priceInterval);
  }, [item.symbol]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {

        const response = await fetch(`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`);
        setSymbolImage(response.url);
        await fetchChartData(item.symbol.toUpperCase(), setChartData, setErrorMessage);
        await fetchCurrentPrice(item.symbol.toUpperCase(), setCurrentPrice);
      } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
        setErrorMessage('Bir hata oluştu');
      }
    };

    fetchAllData();

    return () => { };
  }, [item]);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animatable.View
        style={[styles.container, { height: expanded ? 300 : 80 }]}
        transition="height"
        duration={500}
        easing="ease"
      >
        <View style={styles.topContainer}>
          <View style={styles.leftColumn}>
            <Image style={styles.symbol}
              source={{
                uri: symbolImage,
              }}
            />
          </View>

          <View style={styles.middleColumn}>
            <Text style={styles.textb}>{item.name}</Text>
            <Text>{item.symbol}</Text>
          </View>

          <View style={styles.rightColumn}>
            <Text style={styles.currentPrice}>${currentPrice ? currentPrice.toFixed(2) : '-'}</Text>
          </View>
        </View>

        <View style={styles.graf}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text />
            </View>
          ) : expanded && chartData && chartData.prices && chartData.prices.length > 0 ? (
            <LineChart
              data={{
                labels: chartData.prices.map(priceData => priceData[0]),
                datasets: [
                  {
                    data: chartData.prices.map(priceData => priceData[1]),
                  },
                ],
              }}
              width={280}
              height={220}
              yAxisSuffix="$"
              chartConfig={{
                backgroundColor: "#EFEFEF",
                backgroundGradientFrom: "#EFEFEF",
                backgroundGradientTo: "#EFEFEF",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 10,
                },
                propsForDots: {
                  r: "2",
                  strokeWidth: "1",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                borderRadius: 16,
              }}
            />
          ) : null}
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#EFEFEF',
    width: '80%',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  graf: {
    paddingLeft: 5,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftColumn: {
    paddingRight: 10,
  },
  middleColumn: {
    flex: 1,
    left: 30,
    alignItems: 'flex-start',
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  textb: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  symbol: {
    width: 40,
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Item;
