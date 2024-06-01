import React, { PureComponent } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { LineChart } from "react-native-chart-kit";

class Item extends PureComponent {
  state = {
    expanded: false,
    chartData: null,
    errorMessage: '',
    currentPrice: null,
    symbolImage: null,
  };

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData = async () => {
    const { item } = this.props;
    try {
      const response = await fetch(`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`);
      this.setState({ symbolImage: response.url });

      await this.fetchChartData(item.symbol.toUpperCase());
      await this.fetchCurrentPrice(item.symbol.toUpperCase());
    } catch (error) {
      console.error("Veri alınırken bir hata oluştu:", error);
      this.setState({ errorMessage: 'Bir hata oluştu' });
    }
  };

  fetchChartData = async (symbol) => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=7`);
      const data = await response.json();
      if (data.code === -1121) {
        this.setState({ errorMessage: 'Veri yok' });
        return;
      }
      const prices = data.map(item => {
        const date = new Date(item[0]);
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return [day, parseFloat(item[4])];
      });
      this.setState({ chartData: { prices } });
    } catch (error) {
      console.error("Veri alınırken bir hata oluştu:", error);
      this.setState({ errorMessage: 'Bir hata oluştu' });
    }
  };

  fetchCurrentPrice = async (symbol) => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
      const data = await response.json();
      this.setState({ currentPrice: parseFloat(data.price) });
    } catch (error) {
      console.error("Geçerli fiyat alınırken bir hata oluştu:", error);
    }
  };

  handlePress = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  render() {
    const { item } = this.props;
    const { expanded, chartData, errorMessage, currentPrice, symbolImage } = this.state;

    return (
      <TouchableOpacity onPress={this.handlePress}>
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
                width={320}
                height={215}
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
  }
}

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
