import { StyleSheet, Text, View , TextInput } from 'react-native'
import React from 'react'

export default function input({
  label,
  keyboardType,
  onUpdateValue,
  value,
  secure,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label,isInvalid && styles.labelInValid]}>{label}</Text>
      <TextInput style={[styles.textInput , isInvalid && styles.inputInValid]}
      autoCapitalize='none'
      keyboardType={keyboardType}
      onChangeText={onUpdateValue}
      value={value}
      secureTextEntry={secure}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer:{
    marginVertical:8,
  },
  label:{
    color:'#fff',
    marginBottom:3,
  },
  labelInValid:{
    color:'#f00'
  },
  textInput:{
    backgroundColor:'#FDFFE4',
    paddingVertical:4,
    paddingHorizontal:10,
    borderRadius:20,
    fontSize:16,
  },
  inputInValid:{
    backgroundColor:'#f00'
  },
});