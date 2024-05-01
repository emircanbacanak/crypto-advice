import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchText, setSearchText }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    Animated.timing(animation, {
      toValue: isSearchOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const iconPositionInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['50%', '-2%'],
  });

  const widthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '90%'],
  });

  return (
    <View style={styles.container}>

      <Animated.View style={[styles.iconContainer, { left: iconPositionInterpolate }]}>
        <TouchableOpacity onPress={toggleSearch}>
          <Ionicons name="search" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.searchContainer, { width: widthInterpolate }]}>
        <TextInput
          style={[styles.input, { opacity: isSearchOpen ? 1 : 0 }]}
          placeholder="Search..."
          placeholderTextColor="#999"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          pointerEvents={isSearchOpen ? 'auto' : 'none'}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingRight: 50,
    paddingVertical: 30,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  iconContainer: {
    position: 'absolute',
    paddingBottom: 22,
    paddingLeft: 20,
  },
  icon: {
    marginRight: 10,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 45,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    overflow: 'hidden',
    alignItems: 'stretch',
  },
  input: {
    flex: 1,
    height: 35,
    paddingHorizontal: 5,
    opacity: 0,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 16,
  },
});

export default SearchBar;