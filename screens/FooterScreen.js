import { StyleSheet, Pressable, View } from 'react-native'
import React from 'react'
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from "@react-navigation/native";


export default function FooterScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.str}>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={({ pressed }) => pressed && styles.pressed}
                    onPress={() => navigation.navigate('Home')}>
                    <Entypo name="home" style={styles.icon} size={37} color={'#fff'} />
                </Pressable>

                <Pressable
                    style={({ pressed }) => pressed && styles.pressed} 
                    onPress={() => navigation.navigate('Arbitraj')}>
                    <FontAwesome name="signal" size={37} color="#fff" />
                </Pressable>

                <Pressable
                    style={({ pressed }) => pressed && styles.pressed}
                    onPress={() => navigation.navigate('Settings')}>
                    <FontAwesome name="user" style={styles.icon} size={37} color="#fff" />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    str: {
        paddingBottom: 25,
        height: 80,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#000',

    },
    pressed: {
        opacity: 0.5,
    },
})

