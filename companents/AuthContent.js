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

    function forget() {
        navigation.navigate('Forget')
    }
    return (
        <ImageBackground source={{ uri: 'https://i.hizliresim.com/7g68l5i.jpg' }} style={{ height: '100%' }} >
            <View style={isLogin ? styles.containerg : styles.containerk}>

                <AuthForm credentialsInValid={credentialsInValid} isLogin={isLogin} onsubmit={submitHandler} />

                <View>
                    <ButtonWhite onPress={forget}>
                        {isLogin ? <Text style={styles.textu}>Şifremi unuttumn</Text> : ""}
                    </ButtonWhite>
                    {isLogin ? <Text style={styles.texta}>Hesabın yok mu ? </Text> : <Text style={styles.texta}>Hesabın var mı ? </Text>}
                    <ButtonWhite onPress={switchScreen}>
                        {isLogin ? <Text style={styles.textu}>Buradan kayıt olabilirsin</Text> : <Text style={styles.textu}>Buradan giriş yapabilirsin</Text>}
                    </ButtonWhite>
                </View>

            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    containerg: {
        marginTop: '50%',
        marginHorizontal: 30,
        padding: 10,
    },
    containerk: {
        marginTop: '13%',
        marginHorizontal: 30,
        padding: 10,
    },
    textu: {
        textDecorationLine: 'underline'
    },
    texta: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        paddingTop: 15,
    },
})