import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserEmail } from '../companents/actions/userActions';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setEmailError(false);
      setEmail('');
      setPassword('');
    }
  }, [isFocused]);

  const handleLogin = async () => {
    if (!password.trim()) { // Şifrenin boş olup olmadığını kontrol ediyoruz
      Alert.alert('Uyarı', 'Şifre boş olamaz.');
      return;
    }
    try {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        setEmailError(true);
        Alert.alert('Uyarı', 'Geçerli bir e-posta adresi giriniz.');
        return;
      }

      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      dispatch(setUserEmail(user.email));
      const userDocRef = db.collection('Kullanicilar').doc(user.email);
      await userDocRef.update({
        status: 'online'
      });

      navigation.navigate('Home');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Uyarı', 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      } else {
        console.error('Giriş hatası: ', error);
        Alert.alert('Uyarı', 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    }
  };

  const handleForgetPassword = () => {
    navigation.navigate('Forget');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://i.hizliresim.com/7g68l5i.jpg' }} style={styles.container}>
        <Text style={styles.title}>Hoşgeldiniz</Text>
        <TextInput
          style={[styles.input, emailError && styles.errorInput]}
          autoCorrect={false}
          placeholder="E-Mail"
          placeholderTextColor='#FFFFFF'
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          selectionColor="#FFFFFF39"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, emailError && styles.errorInput]}
            autoCorrect={false}
            placeholder="Şifre"
            placeholderTextColor='#FFFFFF'
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
            value={password}
            selectionColor="#FFFFFF39"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.subtitle}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.subtitleText}>Kayıt Ol</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={handleForgetPassword}>
            <Text style={styles.subtitleText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={[styles.button, styles.shadow]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 47,
    marginBottom: 30,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: '#000000',
    padding: 15,
    borderRadius: 10,
    fontSize: 15,
    width: 300,
    marginTop: 20,
    backgroundColor: '#D7D8F581',
    borderWidth: 1,
    borderColor: '#D6D4C1',
  },
  passwordContainer: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
  },
  passwordInput: {
    color: '#000000',
    padding: 15,
    borderRadius: 10,
    fontSize: 15,
    width: 300,
    marginTop: 20,
    backgroundColor: '#D7D8F581',
    borderWidth: 1,
    borderColor: '#D6D4C1',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 40,
  },
  subtitle: {
    marginTop: 10,
    paddingTop: 5,
    marginBottom: 20,
    width: '74%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  subtitleText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Roboto',
  },
  errorInput: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#000000',
    padding: 13,
    borderRadius: 15,
    width: 210,
    borderRadius: 50,
    marginTop: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
});

export default LoginScreen;