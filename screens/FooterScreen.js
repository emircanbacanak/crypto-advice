import { StyleSheet, Pressable, View } from 'react-native';
import React from 'react';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function FooterScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={() => navigation.navigate('Home')}>
                <Entypo name="home" style={styles.icon} size={35} color={'#fff'} />
            </Pressable>

            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={() => navigation.navigate('Arbitraj')}>
                <FontAwesome name="signal" size={35} color="#fff" />
            </Pressable>

            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={() => navigation.navigate('Settings')}>
                <FontAwesome name="user" style={styles.icon} size={35} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 51,
        justifyContent: 'flex-end',
        backgroundColor: '#000000',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.5,
    },
    icon: {
        padding: 10,
    },
});
