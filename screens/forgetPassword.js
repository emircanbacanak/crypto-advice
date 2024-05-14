import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      Alert.alert('Uyarı', 'Geçerli bir e-posta adresi giriniz.');
      setEmailError(true);
      return;
    }
  
    try {
      const snapshot = await db.collection('Kullanicilar').where('email', '==', email).get();
      if (snapshot.empty) {
        Alert.alert('Uyarı', 'Bu e-posta adresine kayıtlı bir hesap bulunamadı.');
        return;
      }
  
      await auth.sendPasswordResetEmail(email);
      Alert.alert('Başarılı', 'Şifre sıfırlama e-postası gönderildi.');
    } catch (error) {
      console.error("Şifre sıfırlama e-postası gönderilirken bir hata oluştu:", error);
      Alert.alert('Hata', 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.');
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://i.hizliresim.com/7g68l5i.jpg' }} style={styles.container} >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Şifremi Unuttum</Text>
        <TextInput
          style={styles.input}
          placeholder="E-posta adresinizi girin"
          placeholderTextColor="#FFFFFFAD"
          color="#000000"
          selectionColor={"#FFFFFF39"}
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
    width:'100%',
    height:'100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#ffffff',
    marginRight:'80%',
    fontWeight: 'bold',
    fontSize: 17,
    padding:15,
  },
  title: {
    fontSize:30,
    fontWeight: 'bold',
    marginBottom: 40,
    color:'#FFFFFF'
  },
  input: {
    padding: 15,
    borderRadius: 10,
    width: 300,
    marginTop: 20,
    backgroundColor: '#D7D8F581',
    borderWidth: 1,
    borderColor: '#D6D4C1',
  },
  button: {
    alignItems:'center',
    backgroundColor: '#000000',
    padding: 13,
    borderRadius: 15,
    width: 210,
    borderRadius: 50,
    marginTop: '15%',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ForgetPassword;
