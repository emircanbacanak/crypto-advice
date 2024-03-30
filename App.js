import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LinearGradient from 'expo-linear-gradient';

const Stack = createNativeStackNavigator();

function NormalStack() {
  return (
    < Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:'#2516FA',
      },
      headerTintColor:'#fff',
      contentStyle:{
        backgroundColor:'#fff'
      }
    }} >
      <Stack.Screen name="Login" component={LoginScreen} 
        options={{
          headerTitle:'Kullanıcı Giriş'
        }}
      />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator >
  )
}

export default App = () => {
  return (
    <NavigationContainer>
      <NormalStack />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBlockColor:'#fff'
  }
});