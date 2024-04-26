import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // firebase yerine auth olarak ithal edilir

const ForgetPassword = () => {
  const [email, setEmail] = React.useState('');
  const navigation = useNavigation();

  const handleResetPassword = () => {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("Şifre sıfırlama e-postası gönderildi")
      })
      .catch((error) => {
        alert("Şifre sıfırlama e-postası gönderilirken bir hata oluştu: ");
      });
  };
  

  return (
    <ImageBackground source={{ uri: 'https://i.hizliresim.com/7g68l5i.jpg' }} style={{ height: '100%' }} >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Şifremi Unuttum</Text>
        <TextInput
          style={styles.input}
          placeholder="E-posta adresinizi girin"
          placeholderTextColor="#000000"
          color="#000000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Şifremi Sıfırla</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
    padding:15,
  },
  title: {
    fontSize:30,
    fontWeight: 'bold',
    marginBottom: 40,
    color:'#AFF5F5'
  },
  input: {
    backgroundColor:'#ffffff',
    width: '80%',
    height: 45,
    borderWidth: 1,
    marginBottom: 3,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C6C6C',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ForgetPassword;
