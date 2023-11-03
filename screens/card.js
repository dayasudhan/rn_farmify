import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/utils';
import { StatusBar } from "expo-status-bar";
import { EvilIcons } from '@expo/vector-icons'; 

const CardGrid = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (loading || allDataFetched) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}items_by_page?page=${page}&pageSize=${pageSize}`
      );

      if (response.data.length > 0) {
        setData((prevData) => [...prevData, ...response.data]);
        setPage(page + 1);
      } else {
        setAllDataFetched(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    // Example of a memoized component
    const MemoizedCard = React.memo(({ item }) => {
      const handleCardPress = () => {
        navigation.navigate('ItemDetail', { data: item });
      };

      return (
        <TouchableOpacity style={styles.card} onPress={handleCardPress}>
          <Image source={{ uri: item.image_urls[0] }} style={styles.cardImage} />
          <Text style={styles.cardText}>{item.name}</Text>
          <View style={styles.rightContent}>
            <EvilIcons name="location" size={14} color="black" />
            <Text style={styles.cardText2}>{item.district}, ₹ {item.price}</Text>
          </View>
        </TouchableOpacity>
      );
    });

    return <MemoizedCard item={item} />;
  };

  const filteredData = data.filter((item) => {
    return (
      item?.['name']?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.['description']?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.['address']?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.['city']?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          onEndReached={fetchData}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#b8e9f2',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 1,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 180,
    height: 150,
    marginBottom: 1,
  },
  cardText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardText2: {
    fontSize: 12,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CardGrid;
