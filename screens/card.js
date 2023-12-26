import React, { useEffect, useState, memo } from 'react';
import {AppState , View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/utils';
import { StatusBar } from "expo-status-bar";
import { EvilIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../AuthContext';
const MemoizedCard = memo(({ item, onPress }) => {
  const handleCardPress = () => {
    onPress();
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

const CardGrid = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const [pageSize] = useState(50);
  const {  setLocation} = useAuth();

  const [appState, setAppState] = useState(AppState.currentState);
  //const [firstTime, setFirstTime] = useState(false);
  const handleAppStateChange = (nextAppState) => {
    console.log('App state changed:', nextAppState);
    setAppState(nextAppState);
    if(nextAppState === 'active')
    {
      //setFirstTime(true);
      console.log("nextAppState",nextAppState)
      fetchData2(true);
    }
  };
  const fetchData = () =>{
    return fetchData2(false)
  }
  const fetchData2 = async (firstTime) => {
    console.log("fetchData1",page,loading,allDataFetched,firstTime)
    if (!firstTime && (loading || allDataFetched )) 
    {
      console.log("54 line")
      return;
    }

    setLoading(true);
    const pg = firstTime?1:page;
    console.log("pg",pg)
    try {
      const response = await axios.get(
        `${BASE_URL}items_by_page?page=${pg}&pageSize=${pageSize}`
      );

      if (response.data.length > 0) {
        setData((prevData) => {
          const uniqueItems = response.data.filter((newItem) => {
            return !prevData.some((prevItem) => prevItem.id === newItem.id);
          });

          return firstTime ?[...uniqueItems,...prevData]:[...prevData, ...uniqueItems];
        });
        // setFirstTime(false);
        if(!firstTime || (firstTime &&page==1 ))
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
  async function getLocation() {
    console.log("getLocation")
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log("location",location)
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setLocation(coords);
}
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    // if(appState === 'active')
    // {
    //   console.log("appState",appState)
      fetchData();
   // }
    // const onFocus = navigation.addListener('focus', () => {
    //   console.log('CardGrid component is focused');
    //   fetchData();
    // });

    // const onBlur = navigation.addListener('blur', () => {
    //   console.log('CardGrid component is blurred');
    // });
    return () => {
      subscription.remove();
      console.log('Card Component is unmounted');
    };
  },[]);
  useEffect(() => {
    getLocation();
  },[]);
  // useEffect(() => {
  //   fetchData();
  // },[firstTime]);
  const renderItem = ({ item }) => {
    return (
      <MemoizedCard
        item={item}
        onPress={() => {
          navigation.navigate('ItemDetail', { data: item });
        }}
      />
    );
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
          placeholder="Search the item or place ..."
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
