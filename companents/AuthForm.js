import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'

export default function AuthForm({ isLogin, onsubmit, credentialsInValid }) {

    const [enteredEmail, setEnteredEmail] = useState('')
    const [enteredPassword, setEnteredPassword] = useState('')
    const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('')
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('')

    const {
        email: emailIsInvalid,
        confirmEmail: emailsDontMach,
        password: passwordIsInvalid,
        confirmPassword: passwordDontMach,
    } = credentialsInValid

    console.log(emailIsInvalid, emailsDontMach, passwordIsInvalid, passwordDontMach);
    function submitHandler() {
        onsubmit({
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
            confirmPassword: enteredConfirmPassword,
        })
    }
    function updateInput(inputType, enteredValue) {
        switch (inputType) {
            case 'email':
                setEnteredEmail(enteredValue)
                break;
            case 'password':
                setEnteredPassword(enteredValue)
                break;
            case 'confirmEmail':
                setEnteredConfirmEmail(enteredValue)
                break;
            case 'confirmPassword':
                setEnteredConfirmPassword(enteredValue)
                break;
        }
    }

    return (

        <View>
            <StatusBar hidden={true} />
            {isLogin ?
                <Text style={styles.textb}>Giriş</Text>
                :
                <Text style={styles.textb}>YENİ HESAP OLUŞTUR</Text>
            }

            <Input
                label="E-mail"
                keyboardType="email-address"
                onUpdateValue={updateInput.bind(this, 'email')}
                value={enteredEmail}
                isInvalid={emailIsInvalid}
            />

            {!isLogin && (
                <Input
                    label="E-mail Doğrula"
                    keyboardType="email-address"
                    onUpdateValue={updateInput.bind(this, 'confirmEmail')}
                    value={enteredConfirmEmail}
                    isInvalid={emailsDontMach}
                />)}

            <Input
                label="Şifre"
                secure
                onUpdateValue={updateInput.bind(this, 'password')}
                value={enteredPassword}
                isInvalid={passwordIsInvalid}
            />

            {!isLogin && (
                <Input
                    label="Şifreyi Doğrula"
                    secure
                    onUpdateValue={updateInput.bind(this, 'confirmPassword')}
                    value={enteredConfirmPassword}
                    isInvalid={passwordDontMach}
                />)}

            <View style={styles.buttons}>
                <Button onPress={submitHandler} >
                    {isLogin ? 'Giriş Yap' : 'Kaydol '}
                </Button>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    buttons: {
        marginTop: 10,
    },
    textb: {
        color: '#ffffff',
        fontSize: 35,
        textAlign: 'center',
        paddingBottom: 10,
        fontWeight: 'bold',
    },
})