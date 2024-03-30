import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {styles} from './src/style';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const chekUser = () => {
    if (email == 'canemircan973@gmail.com' && password == '123456') {
      alert('Başarili');
    } else {
      alert('Başarisiz');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={value => {
          setEmail(value);
        }} // texte girileni value ye atama
        style={{
          borderColor: '#00f',
          borderWidth: 1,
          width: '100%',
          height: 60,
          marginBottom: 10,
        }}></TextInput>

      <TextInput
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={value => {
          setPassword(value);
        }} // texte girileni value ye atama
        style={{
          borderColor: '#00f',
          borderWidth: 1,
          width: '100%',
          height: 60,
          marginBottom: 10,
        }}></TextInput>

      <TouchableOpacity
        onPress={() => {
          chekUser();
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00f',
          padding: 5,
          width: '100%',
          height: 60,
          borderRadius: 50,
        }}>
        <Text style={styles.textStyle}>Giriş</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
