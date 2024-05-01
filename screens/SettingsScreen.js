import { StyleSheet, TextInput, View, Pressable, StatusBar, Text } from 'react-native'
import React, { useContext } from 'react'
import FooterScreen from './FooterScreen'
import { AuthContext } from '../store/auth-context';

export default function SettingsScreen() {
  const authContext = useContext(AuthContext);
  return (
    <>
      <View style={{backgroundColor:'#000000'}}>
        <Text style={styles.baslik} >Profilim</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            autoCapitalize='none' />
          <TextInput
            style={styles.input}
            autoCapitalize='none' />
        </View>
        <View style={styles.footerContainer}>
          <FooterScreen />
        </View>
        <View style={styles.exit}>
          <StatusBar hidden={true} />
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={authContext.logout}
          >
            <Text style={styles.cikis}>ÇIKIŞ</Text>
          </Pressable>
        </View>
      </View>
      <View>
        <FooterScreen/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: '87%',
    paddingTop: 150,
    backgroundColor: '#000000',
  },
  input: {
    marginBottom: '10%',
    alignSelf:'center',
    backgroundColor: '#FDFFE4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 16,
    width: '80%',
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cikis: {
    color: '#ffffff',
    fontSize: 20,
    color: '#ff0000'
  },
  pressed: {
    opacity: 0.5,
  },
  baslik:{
    paddingTop:'20%',
    fontSize:30,
    alignSelf:'center',
    color:'#ffffff'
  },
  exit: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -16 }], // İkonun yatayda ortalanması için
    backgroundColor: '#000000',
    borderRadius: 30,
    marginBottom: 50,
  }
});