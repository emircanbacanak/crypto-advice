import { StyleSheet, Pressable, View } from 'react-native'
import React from 'react'
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

export default function FooterScreen() {
    return (
        <View style={styles.str}>
            <View style={styles.buttonContainer}>
                <Pressable>
                    <Entypo name="home" style={styles.icon} size={40} color={'#fff'} />
                </Pressable>

                <Pressable>
                    <FontAwesome name="signal" size={40} color="#fff" />
                </Pressable>

                <Pressable>
                    <FontAwesome name="user" style={styles.icon} size={40} color="#fff" />
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

    }
})

