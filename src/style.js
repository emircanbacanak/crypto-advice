import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start   ',
    alignContent: 'flex-start',
    backgroundColor: '#f00'
  },
  textStyle: {
    fontSize:24,
    textAlign:'center',
    color: '#fff',

  },

  header: {
    flex: 2,
    alignContent: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  }

})