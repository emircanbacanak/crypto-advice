import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import AuthForm from './AuthForm'
import ButtonWhite from './ButtonWhite'
import { useNavigation } from '@react-navigation/native'

export default function AuthContent({ isLogin }) {
    const navigation = useNavigation();
    const [credentialsInValid, setCredentialsInValid] = useState({
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
    });

    function submitHandler(credentials) {
        console.log("Credentials:", credentials);
        let { confirmEmail, confirmPassword, email, password } = credentials

        email = email.trim();
        password = password.trim();

        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 6;
        const emailsAreEquil = email === confirmEmail;
        const passwordAreEquil = password === confirmPassword;

        if (
            !emailIsValid ||
            !passwordIsValid ||
            (!isLogin && (!emailsAreEquil || !passwordAreEquil))) {
            Alert.alert('Hops! Lütfen Girdiğiniz Değerleri Kontrol Ediniz!');
            setCredentialsInValid({ //doğru formatta girilenler false oluyor
                email: !emailIsValid,
                confirmEmail: !emailIsValid || !emailsAreEquil,
                password: !passwordIsValid,
                confirmPassword: !passwordIsValid || !passwordAreEquil
            })
            return;
        }

    }

    function switchScreen() {
        if (isLogin) {
            navigation.navigate('Signup')
        } else {
            navigation.navigate('Login')
        }
    }

    return (
        <View style={styles.container}>
            <AuthForm credentialsInValid={credentialsInValid} isLogin={isLogin} onSubmit={submitHandler} />
            <View>
                <ButtonWhite onPress={switchScreen}>
                    {isLogin ? 'Yeni Kullanıcı Oluştur' : 'Giriş Yap'}
                </ButtonWhite>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        backgroundColor: '#2516fA',
        marginHorizontal: 30,
        padding: 10,
        borderRadius: 15,
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 100000,
    },
})
