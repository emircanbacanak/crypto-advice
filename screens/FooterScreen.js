import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function FooterScreen() {
    const navigation = useNavigation();

    if (!navigation) {
        return null;
    }

    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    const navigateToArbitraj = () => {
        navigation.navigate('Arbitraj');
    };

    const navigateToSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={navigateToHome}>
                <Entypo name="home" style={styles.icon} size={35} color={'#fff'} />
            </Pressable>

            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={navigateToArbitraj}>
                <FontAwesome name="signal" size={35} color="#fff" />
            </Pressable>

            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={navigateToSettings}>
                <FontAwesome name="user" style={styles.icon} size={35} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 51,
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
