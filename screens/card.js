import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const data = [
  { id: '1', title: 'Card 1', image: require('./../assets/profile.jpg') },
  { id: '2', title: 'Card 2', image: require('./../assets/profile.jpg') },
  { id: '3', title: 'Card 3', image: require('./../assets/profile.jpg') },
  { id: '4', title: 'Card 4', image: require('./../assets/profile.jpg') },
  // Add more data items as needed
];

const CardGrid = () => {
  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      numColumns={2} // Adjust the number of columns as needed
    />
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