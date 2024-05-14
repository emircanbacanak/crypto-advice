import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import Item from '../companents/Item';
import { fetchData } from '../companents/api';
import { AuthContext } from '../store/auth-context';

const HomeScreen = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchDataAndUpdate();
    const intervalId = setInterval(fetchDataAndUpdate, 20000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchText]);

  const fetchDataAndUpdate = async () => {
    try {
      const res = await fetchData(token);
      setData(res.data);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  return (
    <View style={styles.body}>
      <StatusBar hidden={true} />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.hosgeldin}>
            <Text style={styles.subtitle}>Borsa Güncel Bilgileri</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hosgeldin: {
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 30,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
});

export default HomeScreen;