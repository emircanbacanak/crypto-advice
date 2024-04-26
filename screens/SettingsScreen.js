import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import FooterScreen from './FooterScreen'


export default function SettingsScreen() {
  return (
    <>
      <View style={styles.inputContainer}>

        <TextInput
          style={[styles.input ,{margin:40, }] }
          autoCapitalize='none' />

        <TextInput
          style={[styles.input ,{marginLeft:40, }]}
          autoCapitalize='none' />

      </View>

      <View>
        <FooterScreen />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    height: '94%',
    width:'100%',
    backgroundColor: '#30D5C8',
  },
  input: {
    marginBottom: '20%',
    backgroundColor: '#FDFFE4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 16,
    width: '80%',
  },
})