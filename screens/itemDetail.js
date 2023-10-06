import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ImageWithDescription = ({ imageUri, description }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg" }} style={styles.image} />
      <Text style={styles.description}>description</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
  },
});

export default ImageWithDescription;