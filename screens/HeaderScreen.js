import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../store/auth-context';
import { Ionicons } from '@expo/vector-icons';

export default function AfterScreen() {
  const authContext = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => pressed && styles.pressed}
        onPress={authContext.logout}
      >
        <Ionicons name="exit" size={30} color={'#fff'} />
      </Pressable>
    </View>


  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  container: {
    height:60,
    justifyContent:'center',
    alignItems:'flex-end',
    backgroundColor: '#000',
  },
})