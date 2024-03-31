import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

function NormalStack() {
  return (
    < Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#2516FA',
      },
      headerTintColor: '#fff',
      contentStyle: {
        backgroundColor: '#fff'
      }
    }} >

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: 'Kullanıcı Giriş'
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerTitle: 'Kullanıcı Kayıt'
        }}
      />
    </Stack.Navigator >
  )
}

function AfterAuthenticatedStack() {
  return (
    < Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#2516FA',
      },
      headerTintColor: '#fff',
      contentStyle: {
        backgroundColor: '#fff'
      }
    }} >

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'Anasayfa'
        }}
      />
    </Stack.Navigator >
  )
}

function Navigation() {
  const authContext = useContext(AuthContext)
  return ( //eğer giriş yapıldıysa buraya yönlendir AfterAuthenticatedStack(HomeScreen)
    <NavigationContainer>
      {!authContext.isAuthenticated && <NormalStack />}
      {authContext.isAuthenticated && <AfterAuthenticatedStack />}
    </NavigationContainer>
  )
}

export default App = () => {
  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBlockColor: '#fff'
  }
});