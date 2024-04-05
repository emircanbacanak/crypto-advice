import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FooterScreen from './FooterScreen'
import HeaderScreen from './HeaderScreen'

export default function Arbitraj() {
    return (
        <><View>
            <HeaderScreen />
        </View>
        <View style={styles.container}>
            <Text>Arbitraj Screen</Text>
        </View>
        <View>
            <FooterScreen />
        </View></>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 700,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: '#f00',
    },
    pressed: {
        opacity: 0.5,
    },
})