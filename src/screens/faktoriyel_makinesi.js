const App = () => {
    const [sayi,setSayi] = useState('');
    const [faktoriyel,setFaktoriyel] = useState('');
    
    const getFaktoriyel  = value =>{
      let f = 1;
      for (let index = 1; index <= value; index++) {
          f*=index;
      }
      return f;
  };
  
    return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        padding:10 
        }}>
        <TextInput 
        value={sayi}
        onChangeText={value => {setSayi(value);
          setFaktoriyel('');
        }} // texte girileni value ye atama
        style={{borderColor:'#00f', borderWidth:1,width:'100%',height: 60}}>
        </TextInput>
        
        <TouchableOpacity
          onPress={()=>{
            setFaktoriyel(getFaktoriyel(sayi));
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00f',
            padding: 5,
            width: '100%',
            height: 60,
            borderRadius: 50,
            marginTop: 10,
          }}>
          <Text style={styles.textStyle}>Hesapla</Text>
        </TouchableOpacity>
        <Text style={{fontSize:30}}>{ faktoriyel != '' ? sayi + '=! ' + faktoriyel: ''}</Text>
      </View>
    );
  };
  
  export default App;