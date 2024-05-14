import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { StatusBar ,StyleSheet } from 'react-native';
import store from './companents/store'; // İçe aktarmaları düzelt

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ArbitrajScreen from './screens/Arbitraj';
import ForgetPasswordScreen from './screens/forgetPassword';
import RegisterScreen from './screens/Kayit';
import AuthContextProvider from './store/auth-context';
import { auth } from './firebase';
import FooterScreen from './screens/FooterScreen';

const Stack = createStackNavigator();

const CustomTransition = {
  ...TransitionPresets.SlideFromRightIOS,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 500,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 500,
      },
    },
  },
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <AuthContextProvider>
          {isAuthenticated ? (
            <>
              <AppNavigation />
              <FooterScreen/>
            </>
          ) : (
            <AppNavigation />
          )}
        </AuthContextProvider>
      </NavigationContainer>
    </Provider>
  );
};

const AppNavigation = () => {
  const navigationRef = React.useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log("Kullanıcı oturum açmış");
        navigationRef.current?.navigate('Home');
      } else {
        console.log("Kullanıcı oturum açmamış");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...CustomTransition,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Arbitraj" component={ArbitrajScreen} />
      <Stack.Screen name="Forget" component={ForgetPasswordScreen} />
      <Stack.Screen name="Signup" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default App;

export const handleSignOut = () => {
  auth.signOut().then(() => {
    setIsAuthenticated(false);
  }).catch(error => {
    console.error('Çıkış işlemi sırasında bir hata oluştu:', error);
  });
};
