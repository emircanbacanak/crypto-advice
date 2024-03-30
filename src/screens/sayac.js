const [sayi, setSayi] = useState(0);

  const arttir = () => {
    setSayi(sayi + 1);
  };

  const azalt = () => {
    setSayi(sayi - 1);
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={arttir}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0',
          padding: 5,
          width: 50,
          height: 50,
          borderRadius: 50,
          margin: 10,
        }}>
        <Text style={styles.textStyle}>+</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 30 }}> {sayi}</Text>
      <TouchableOpacity
        onPress={azalt}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f00',
          padding: 5,
          width: 50,
          height: 50,
          borderRadius: 50,
          margin: 10,
        }}>
        <Text style={styles.textStyle}>-</Text>
      </TouchableOpacity>
    </View>
  );