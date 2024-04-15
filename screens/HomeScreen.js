import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FooterScreen from './FooterScreen';
import Item from "../companents/Item";
import { fetchData } from "../companents/api";

export default function HomeScreen() {
  const [data, setData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchDataAndUpdate = async () => {
        try {
          const res = await fetchData();
          if (isActive) {
            setData(res.data);
          }
        } catch (error) {
          console.error("Veri alınırken hata oluştu:", error);
        }
      };

      fetchDataAndUpdate();
      const intervalId = setInterval(fetchDataAndUpdate, 20000);

      return () => {
        clearInterval(intervalId);
        isActive = false;
      };
    }, [])
  );

  return (  
    <>
     <View style={styles.body}>
        <SafeAreaView>
          <FlatList
            data={data}
            extraData={data}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        </SafeAreaView>
      </View>

      <View>
        <FooterScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    height: 700,
    backgroundColor:'#000000'
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#FFFFFF',
  },
});
