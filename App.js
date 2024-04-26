import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import Arbitraj from './screens/Arbitraj';
import ForgetPassword from './screens/forgetPassword';
import FooterScreen from './screens/FooterScreen'; // Yeni eklenen dosya

const Stack = createNativeStackNavigator();

function Navigation() {
  const authContext = useContext(AuthContext);
  if (!authContext.isAuthenticated) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#ffffff',
          contentContainerStyle: { // Değişiklik burada
            backgroundColor: '#ffffff',
          },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: 'Kullanıcı Giriş', // Değişiklik burada
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Forget"
          component={ForgetPassword} // Değişiklik burada
          options={{
            headerTitle: 'Şifremi unuttum', // Değişiklik burada
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerTitle: 'Kullanıcı Kayıt', // Değişiklik burada
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Footer" // Yeni eklenen dosya burada
          component={FooterScreen} // Yeni eklenen dosya burada
          options={{ headerShown: false }} // Yeni eklenen dosya burada
        />
      </Stack.Navigator>
    );
  } else {
    return (
      <>
          <View style={styles.ana}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#2516FA',
                },
                headerTintColor: '#ffffff',
                contentContainerStyle: { // Değişiklik burada
                  backgroundColor: '#ffffff',
                },
                animation: 'slide_from_right',
              }}>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false, headerTitle: 'Kullanıcı Giriş' }} />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="Arbitraj"
                component={Arbitraj}
                options={{ headerShown: false }} />
            </Stack.Navigator>
          </View>
      </>
    );
  }
}

const App = () => { // Değişiklik burada
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  ana: {
    height: '100%',
  },
});
