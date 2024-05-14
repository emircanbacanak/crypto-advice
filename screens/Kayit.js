import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUserPassword, setUserEmail } from '../companents/actions/userActions';
import Icon from 'react-native-vector-icons/FontAwesome';

const Kayit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    name: false,
    surname: false,
    email: false,
    password: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmailError(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleSignUp = async () => {
    let hasError = false;

    const nameError = !name.trim();
    const surnameError = !surname.trim();
    const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordError = password.length < 7;

    setError({
      name: nameError,
      surname: surnameError,
      email: emailError,
      password: passwordError,
    });

    if (!name || !surname || !email || !password) {
      Alert.alert('Uyarı', 'Boş giriş alanları bulunmaktadır.');
      return;
    }

    if (emailError) {
      Alert.alert('Uyarı', 'Geçerli bir e-posta adresi giriniz.');
      return;
    }

    try {
      const snapshot = await db.collection('Kullanicilar').where('email', '==', email).get();
      if (!snapshot.empty) {
        Alert.alert('Uyarı', 'Bu e-posta adresi zaten kayıtlı.');
        return;
      }
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "Kullanicilar", email), {
        name: name,
        surname: surname,
        email: email,
      });
      console.log("Kullanıcı kayıt oldu", user.email);
      dispatch(setUserEmail(email));
      dispatch(setUserPassword(password));
      navigation.navigate("Home");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Uyarı', 'Bu e-posta adresi zaten kayıtlı.');
      } else {
        alert(error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://i.hizliresim.com/7g68l5i.jpg' }} style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kayıt Ol</Text>
        <TextInput
          style={[styles.input, error.name && styles.errorInput]}
          autoCapitalize="sentences"
          autoCorrect={false}
          placeholder="İsim"
          selectionColor={"#FFFFFF39"}
          placeholderTextColor={"#ffffff"}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={[styles.input, error.surname && styles.errorInput]}
          autoCapitalize="sentences"
          autoCorrect={false}
          selectionColor={"#FFFFFF39"}
          placeholder="Soyisim"
          placeholderTextColor={"#ffffff"}
          onChangeText={(text) => setSurname(text)}
        />
        <TextInput
          style={[styles.input, error.email && styles.errorInput]}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={"#FFFFFF39"}
          keyboardType="email-address"
          placeholder="E-Posta"
          placeholderTextColor={"#ffffff"}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, error.password && styles.errorInput]}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={"#FFFFFF39"}
            placeholder="Şifre"
            placeholderTextColor={"#ffffff"}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={[styles.button, styles.shadow]} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 10,
    fontSize:16,
    width: 300,
    marginTop: 20,
    color:'#ffffff',
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
    top: 35,
  },
  errorInput: {
    borderColor: 'red',
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
  title: {
    color: '#ffffff',
    fontSize: 47,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#000000",
    padding: 13,
    borderRadius: 15,
    marginTop: 10,
    width: 200,
    borderRadius: 50,
    marginTop: "10%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 17,
  },
});

export default Kayit;
