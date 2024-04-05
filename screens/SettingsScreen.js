import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FooterScreen from './FooterScreen'
import HeaderScreen from './HeaderScreen'

export default function SettingsScreen() {
  return (
    <><View>
      <HeaderScreen />
    </View>
      <View style={styles.container}>
        <Text>Settings Screen</Text>
      </View>
      <View>
        <FooterScreen />
      </View></>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 700,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#30D5C8',
  }
})