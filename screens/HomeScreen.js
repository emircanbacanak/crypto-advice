import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FooterScreen from './FooterScreen';
import HeaderScreen from './HeaderScreen'

export default function HomeScreen() {
  return (
    <><View>
      <HeaderScreen />
    </View>
      <View style={styles.body}>
        <Text>HomeScreen</Text>
      </View><View>
        <FooterScreen />
      </View></>
  );
}

const styles = StyleSheet.create({
  body: {
    height: 700,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#660099',
  },
});