import { StyleSheet, Text, View, Alert, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import AuthForm from './AuthForm'
import ButtonWhite from './ButtonWhite'
import { useNavigation } from '@react-navigation/native'

export default function AuthContent({ isLogin, onAuthenticate }) {
    const navigation = useNavigation();

    const [credentialsInValid, setCredentialsInValid] = useState({
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
    })

    function submitHandler(credentials) {
        console.log(credentials);
        let { confirmEmail, confirmPassword, email, password } = credentials;

        email = email.trim();
        password = password.trim();

        //şartları karşılayan true oluyor
        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 6;
        const emailsAreEqual = email === confirmEmail;
        const passwordAreEqual = password === confirmPassword;

        if (!emailIsValid || !passwordIsValid || (!isLogin && (!emailsAreEqual || !passwordAreEqual))) {
            Alert.alert('Hops!', 'Lütfen girdiğiniz değerleri kontrol ediniz!');
            setCredentialsInValid({
                email: !emailIsValid,
                confirmEmail: !emailIsValid || !emailsAreEqual,
                password: !passwordIsValid,
                confirmPassword: !passwordIsValid || !passwordAreEqual,
            })
            return;
        }
        onAuthenticate({ email, password })
    }

    function switchScreen() {
        if (isLogin) {
            navigation.navigate('Signup')
        }
        else {
            navigation.navigate('Login')
        }
    }
    return (
        <ImageBackground source={{ uri: 'https://i.hizliresim.com/7g68l5i.jpg' }} style={{ height: '100%' }} >
            <View style={styles.container}>
                <AuthForm credentialsInValid={credentialsInValid} isLogin={isLogin} onsubmit={submitHandler} />
                <View>
                    <ButtonWhite onPress={switchScreen}>
                        {isLogin ? 'Yeni Kullanıcı Oluştur ' : 'Giriş'}
                    </ButtonWhite>
                </View>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: '40%',
        marginHorizontal: 30,
        padding: 10,
    },
})
