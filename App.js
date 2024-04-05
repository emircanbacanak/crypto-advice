import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';
import HomeScreen from './screens/HomeScreen';
import FooterScreen from './screens/FooterScreen';
import HeaderScreen from './screens/HeaderScreen';

const Stack = createNativeStackNavigator();

function NormalStack() {
  return (
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
        name="Login"
        component={LoginScreen}
        options={{
          headerodyTitle: 'Kullanıcı Giriş',
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerTitle: 'Kullanıcı Kayıt',
        }}
      />
    </Stack.Navigator>
  );
}

function AfterAuthenticatedStack() {
  return (
      <View style={styles.ana}>
        <HeaderScreen/>
        <Body />
        <Footer />
      </View>
  );
}



function Navigation() {
  const authContext = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authContext.isAuthenticated ? <NormalStack /> : <AfterAuthenticatedStack />}
    </NavigationContainer>
  );
}
function Body() {
  return (
    <View>
      <HomeScreen />
    </View>

  );
}
function Footer() {
  return (
    <View>
      <FooterScreen />
    </View>

  );
}

export default App = () => {
  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  ana:{
    height:'120%'
  }
});
