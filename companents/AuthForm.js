import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'

export default function AuthForm({ isLogin, onSubmit, credentialsInValid }) {
    const [enteredEmail, setEnteredEmail] = useState('')
    const [enteredPassword, setEnteredPassword] = useState('')
    const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('')
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('')


    const {
        email: emailIsValid,
        confirmEmail: emailsDontMach,
        password: passwordIsValid,
        confirmPassword: passwordDontMach,
    } = credentialsInValid;

    console.log(emailIsValid, emailsDontMach, passwordIsValid, passwordDontMach);

    const updateInput = (inputType, enteredValue) => {
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
            default:
                break;
        }
    }

    const submitHandler = () => {
        onSubmit({
            email: enteredEmail,
            confirmEmail: enteredConfirmEmail,
            password: enteredPassword,
            confirmPassword: enteredConfirmPassword,
        });
    };

    return (
        <View>
            <Input
                label="Email"
                keyboardType="email-address"
                onUpdateValue={(value) => updateInput('email', value)}
                value={enteredEmail}
                isInvalid={emailIsValid}
            />
            {!isLogin && (
                <Input
                    label="Email Doğrula"
                    keyboardType="email-address"
                    onUpdateValue={(value) => updateInput('confirmEmail', value)}
                    value={enteredConfirmEmail}
                    isInvalid={emailsDontMach}
                />
            )}
            <Input
                label="Şifre"
                secure
                onUpdateValue={(value) => updateInput('password', value)}
                value={enteredPassword}
                isInvalid={passwordIsValid}
            />
            {!isLogin && (
                <Input
                    label="Şifre Doğrula"
                    secure
                    onUpdateValue={(value) => updateInput('confirmPassword', value)}
                    value={enteredConfirmPassword}
                    isInvalid={passwordDontMach}
                />
            )}
            <View style={styles.buttons}>
                <Button onPress={submitHandler}>
                    {isLogin ? 'Giriş Yap' : 'Kaydol'}
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttons: {
        marginTop: 10,
    }
})
