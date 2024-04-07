import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';
import HomeScreen from './screens/HomeScreen';
import FooterScreen from './screens/FooterScreen';
import SettingsScreen from './screens/SettingsScreen';
import Arbitraj from './screens/Arbitraj'

const Stack = createNativeStackNavigator();

function Navigation() {
  const authContext = useContext(AuthContext);
  if (!authContext.isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerodyTitle: 'Kullanıcı Giriş',
            headerShown: false ,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerTitle: 'Kullanıcı Kayıt',
            headerShown: false ,
          }}
        />
      </Stack.Navigator>
    )
  }
  else {
    return (
        <View style={styles.ana}>
          <Stack.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: '#2516FA',
            },
            headerTintColor: '#fff',
            contentStyle: {
              backgroundColor: '#fff',
            },
            
          }}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false ,  headerodyTitle: 'Kullanıcı Giriş', }} />

            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}  />

            <Stack.Screen
              name="Arbitraj"
              component={Arbitraj}
              options={{ headerShown: false }} />
              
          </Stack.Navigator>

          <View>
            <FooterScreen />
          </View>

        </View>
    )
  }

}

export default App = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  ana: {
    height: '120%'
  }
});
