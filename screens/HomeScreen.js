import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import Item from '../companents/Item';
import { fetchData } from '../companents/api';
import { AuthContext } from '../store/auth-context';
import SearchBar from '../companents/searchBar';

const HomeScreen = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataAndUpdate();
    const intervalId = setInterval(fetchDataAndUpdate, 20000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toUpperCase().includes(searchText.toUpperCase()) ||
      item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      item.symbol.toUpperCase().includes(searchText.toUpperCase())
    );   
    setFilteredData(filtered);
  }, [data, searchText]);
  

  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetchData(token);
      setData(res.data);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.body}>
      <StatusBar hidden={true} />
      {loading ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <>
              <View style={styles.hosgeldin}>
                <Text style={styles.subtitle}>Borsa Güncel Bilgileri</Text>
              </View>
              <View>
                <SearchBar searchText={searchText} style={styles.search} setSearchText={setSearchText} />
              </View>
            </>
          }
        />
      )}
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
    textAlign: 'center',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default HomeScreen;
