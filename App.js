import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext } from 'react';
import HomeScreen from './screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
          headerTitle: 'Kullanıcı Giriş',
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
  const authContext = useContext(AuthContext);
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
        name="Home"
        component={HomeScreen} // Use HomeScreen directly
        options={{
          headerRight: ({ tintColor }) => (
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={authContext.logout}
            >
              <Ionicons name="exit" size={24} color={tintColor} />
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authContext = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authContext.isAuthenticated ? <NormalStack/>: <AfterAuthenticatedStack/> }
    </NavigationContainer>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBlockColor: '#fff',
  },
  pressed: {
    opacity: 0.5,
  },
});
