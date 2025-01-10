import React, { useContext, useEffect, useState } from 'react';
import { AppState, View, Text, FlatList, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import Item from '../companents/Item';
import { AuthContext } from '../store/auth-context';
import SearchBar from '../companents/searchBar';

const HomeScreen = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsActive(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchDataAndUpdate = async () => {
    try {
      const response = await fetch(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          method: "GET",
          headers: {
            "X-CMC_PRO_API_KEY": "a55ee132-df67-479f-971a-a4bcade81dfb",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Many requests have been made. Wait for a while and try again.");
        } else {
          throw new Error("Invalid response received from API: " + response.status);
        }
      }

      const data = await response.json();

      data.data.forEach((item) => {
        item.quote.USD.price = parseFloat(item.quote.USD.price).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
        item.quote.USD.percent_change_24h = parseFloat(item.quote.USD.percent_change_24h).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
      });

      const currentDate = new Date().toLocaleString();
      setLastUpdated(currentDate);

      if (setData) {
        setData(data.data);
      }
    } catch (error) {
      console.error("An error occurred while retrieving data:", error);
      if (error.message.includes("Too many requests made")) {
        setTimeout(() => {
          fetchDataAndUpdate();
        }, 30000);
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      await fetchDataAndUpdate();
    };

    if (isActive) {
      fetchData();
      intervalId = setInterval(fetchData, 30000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  useEffect(() => {
    if (data && data.length > 0) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.symbol.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [data, searchText]);

  useEffect(() => {
    setLoading(true);
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  return (
    <View style={styles.body}>
      <StatusBar hidden={true} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading Data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Item key={item.id} item={item} />}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          ListHeaderComponent={
            <>
              <View style={styles.welcome}>
                <Text style={styles.subtitle}>Stock Exchange Information</Text>
                {isActive && <Text style={styles.lastUpdated}>Last Update: {lastUpdated}</Text>}
              </View>
              <View>
                <SearchBar searchText={searchText} setSearchText={setSearchText} />
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
    height: '96%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
});

export default HomeScreen;