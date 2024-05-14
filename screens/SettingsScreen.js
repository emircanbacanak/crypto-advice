import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../store/auth-context';

export default function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { isAuthenticated } = useContext(AuthContext);
  const userEmail = useSelector((state) => state.user.userEmail);
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await db.collection('Kullanicilar').doc(userEmail).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(userData.name);
          setUserSurname(userData.surname);
        }
      } catch (error) {
        console.error('Kullanıcı verisi getirilirken hata oluştu:', error);
      }
    };

    if (db) {
      fetchUserData();
    } else {
      console.error('Firestore başlatılamadı!');
    }
  }, [userEmail]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
      console.log('Kullanıcı çıkış yaptı');
    } catch (error) {
      console.error('Kullanıcı durumu güncellenirken bir hata oluştu:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [isAuthenticated, navigation]);

  return (
    <View style={{ backgroundColor: '#000000' }}>
      <Text style={styles.baslik}>Profilim</Text>

      <View style={styles.inputContainer}>

        <View style={styles.underline}></View>

        <View style={styles.inputRow}>
          <Text style={styles.text}>Ad</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.input}>{userName}</Text>
        </View>

        <View style={styles.underline}></View>

        <View style={styles.inputRow}>
          <Text style={styles.text}>Soyad</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.input}>{userSurname}</Text>
        </View>

        <View style={styles.underline}></View>

        <View style={styles.inputRow}>
          <Text style={styles.text}>E-Mail</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.input}>{userEmail}</Text>
        </View>

        <View style={styles.underline}></View>

        <View style={styles.exit}>
          <StatusBar hidden={true} />
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={handleSignOut}
          >
            <Text style={styles.cikis}>ÇIKIŞ</Text>
          </Pressable>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: '87%',
    paddingTop: 100,
    backgroundColor: '#000000',
  },
  underline: {
    borderBottomColor: '#0073FF84',
    borderBottomWidth: 1,
    width: '90%',
    marginLeft: 20,
  },
  colon: {
    color: '#ffffff',
    fontSize: 20,
  },
  inputRow: {
    left: 40,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  text: {
    flex: 0.17,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 0.7,
    textAlign: 'left',
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 20,
    color: '#ffffff',
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cikis: {
    fontSize: 20,
    color: '#FFFFFF'
  },
  pressed: {
    opacity: 0.5,
  },
  baslik: {
    paddingTop: '30%',
    fontSize: 45,
    alignSelf: 'center',
    color: '#ffffff'
  },
  exit: {
    top: 180,
    alignSelf:'center',
    height:40,
    width:75,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#FF0000',
  }
});
