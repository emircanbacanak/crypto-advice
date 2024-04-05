import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';



export default function HomeScreen() {
  return (

    <View style={styles.body}>
      <Text>HomeScreen</Text>
    </View>

  );
}

const styles = StyleSheet.create({
  body: {
    height: 700,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#ff0',
  },
  body2: {
    backgroundColor: '#00f'
  }
});