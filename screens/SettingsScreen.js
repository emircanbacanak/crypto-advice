import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
  backgroundColor:'#fff',
  height:600,
}
})