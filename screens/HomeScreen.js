import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar } from 'react-native';
import FooterScreen from './FooterScreen';
import Item from "../companents/Item";
import { fetchData } from "../companents/api";
import SearchBar from '../companents/searchBar';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchDataAndUpdate();
    const intervalId = setInterval(fetchDataAndUpdate, 20000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchText]);

  const fetchDataAndUpdate = async () => {
    try {
      const res = await fetchData();
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <SearchBar style={styles.searchBar} searchText={searchText} setSearchText={setSearchText} />
      <View style={styles.body}>
        <StatusBar hidden={true} />
        <SafeAreaView>
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.id.toString()} />
        </SafeAreaView>
      </View>
      <View style={styles.footer}>
        <FooterScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    height:670,
    backgroundColor: '#000000',
  },
  footer:{
    marginBottom:'0%',
    alignItems:'flex-end',
    justifyContent:'flex-end',
  },
  searchBar: {
    height: 5,
  }
});
