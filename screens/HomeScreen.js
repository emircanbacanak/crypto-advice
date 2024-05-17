import React, { useContext, useEffect, useState } from 'react';
import { AppState, View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import Item from '../companents/Item';
import { fetchDataAndUpdate } from '../companents/api';
import { AuthContext } from '../store/auth-context';
import SearchBar from '../companents/searchBar';

const HomeScreen = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsActive(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      await fetchDataAndUpdate(token, setData, setLastUpdated);
      intervalId = setInterval(() => {
        fetchDataAndUpdate(token, setData, setLastUpdated);
      }, 30000);
    };

    if (isActive) {
      fetchData();

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [token, isActive]);

  useEffect(() => {
    if (data && data.length > 0) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.name.toUpperCase().includes(searchText.toUpperCase()) ||
        item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
        item.symbol.toUpperCase().includes(searchText.toUpperCase())
      );
      setFilteredData(filtered);
    }
  }, [data, searchText]);

  return (
    <View style={styles.body}>
      <StatusBar hidden={true} />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <Item key={item.id} item={item} isActive={isActive} />} // Item bileşenine isActive özelliğini geçir
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        ListHeaderComponent={
          <>
            <View style={styles.welcome}>
              <Text style={styles.subtitle}>Borsa Güncel Bilgileri</Text>
              {isActive && <Text style={styles.lastUpdated}>Son Güncelleme: {lastUpdated}</Text>}
            </View>
            <View>
              <SearchBar searchText={searchText} style={styles.search} setSearchText={setSearchText} />
            </View>
          </>
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
  welcome: {
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
  lastUpdated: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;
