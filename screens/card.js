import React,  {useEffect, useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet,SafeAreaView } from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/utils';
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CardGrid = ({navigation}) => {

  const [data, setData] = useState([]);
  useEffect(() => {
    console.log('reacteffect');

    axios.get(BASE_URL+'items').then((response) => {
      setData(response.data);
      console.log('response', response.data);
    });
  }, []);

  const renderCard = ({ item }) => {

    const handleCardPress = () => {
      console.log("handleCardPress")
      navigation.navigate('itemDetail',{ data: item });
    };
  
    return (
      <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        <Image source={{ uri: item.image_urls[0] }} style={styles.cardImage} />
        <Text style={styles.cardText}>{item.name}, {item.price}</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <>


    <StatusBar style="light" />

    <SafeAreaView style={styles.container}>
   
    
      <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          >
    <FlatList
      data={data}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      numColumns={2} // Adjust the number of columns as needed
    />
     
    </KeyboardAwareScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
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
    width: 120,
    height: 120, // Adjust the size of the image as needed
    marginBottom: 1,
  },
  cardText: {
    fontSize: 18,
  },
});

export default CardGrid;