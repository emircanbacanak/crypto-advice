import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Foundation } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const Item = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedPrice = parseFloat(item.quote.USD.price).toFixed(3).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
  const formattedChange = parseFloat(item.quote.USD.percent_change_24h).toFixed(3);
  const textColor = formattedChange < 0 ? '#C60000' : '#0c9000';

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animatable.View
        style={[styles.container, { height: expanded ? 200 : 100 }]}
        transition="height"
        duration={500} // Animasyon süresi
        easing="ease" // Kolay animasyon
      >
        <View style={styles.leftColumn}>
          <Image style={styles.symbol}
            source={{
              uri: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
            }}
          />
        </View>

        <View style={styles.middleColumn}>
          <Text style={styles.textb}>{item.name}</Text>
          <Text>{item.symbol}</Text>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.texts}>
            {formattedPrice}$  {formattedChange < 0 ?
              <Foundation
                name="arrow-down"
                size={25}
                style={{
                  color: textColor,
                }} />
              :
              <Foundation
                name="arrow-up"
                size={25}
                style={{ color: textColor }} />}
          </Text>
          <Text style={[styles.textsb, { color: textColor }]}>{formattedChange}%</Text>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#EFEFEF',
    width: '75%',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  leftColumn: {
    paddingRight: 5,
    alignItems: 'flex-start',
  },
  middleColumn: {
    color: '#000000',
    alignItems: 'center',
  },
  rightColumn: {
    alignItems: 'flex-end',
    color: '#000000',
  },
  textb: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  texts: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textsb: {
    fontSize: 14,
    paddingRight: 20,
  },
  symbol: {
    width: 40,
    height: 40,
  },
});

export default Item;
