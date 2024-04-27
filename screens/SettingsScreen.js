import { StyleSheet, TextInput, View, Pressable, StatusBar } from 'react-native'
import React, { useContext } from 'react'
import FooterScreen from './FooterScreen'
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../store/auth-context';

export default function SettingsScreen() {
  const authContext = useContext(AuthContext);
  return (
    <>
      <View style={styles.inputContainer}>

        <TextInput
          style={[styles.input, { margin: 40, }]}
          autoCapitalize='none' />

        <TextInput
          style={[styles.input, { marginLeft: 40, }]}
          autoCapitalize='none' />
      </View>
      <View style={styles.exit}>
        <StatusBar hidden={true} />
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={authContext.logout}
        >
          <Ionicons name="exit" size={30} color={'#ffffff'} />
        </Pressable>
      </View>
      <View>
        <FooterScreen />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    height: '90%',
    width: '100%',
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
  pressed: {
    opacity: 0.5,
  },
  exit: {
    backgroundColor: '#000000',
    alignSelf:'flex-end'
  }
})