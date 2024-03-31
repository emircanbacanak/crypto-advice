import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

export default function Button({ children, onPress }) {
    return (
        <Pressable style={({ pressed }) => [styles.button,
        pressed && styles.pressed]}
            onPress={onPress}
        >
            <View>
                <Text style={styles.Text}>{children}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6C6C6C',
        paddingVertical: 10,
        borderRadius: 20,
    },
    pressed: {
        opacity: 0.5,
    },
    Text: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }

})