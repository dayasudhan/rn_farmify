import React from 'react';
import { View, Image, Text, StyleSheet ,TouchableOpacity} from 'react-native';

import ImageGallery from './ImageGallery';
import ImageGallery2 from './ImageGallery2';
const imageUrls = [
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-457982009-1695640635314-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-457982009-1695640635314-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-457982009-1695640635314-.jpeg',
];

const MyImageComponent = () => {
  function handleSubmit()
  {
    
  }
  return (
    <View style={styles.container}>
      
     
      <View style={styles.infoContainer}>
      <Text style={styles.title}>Cultivator</Text>
      <ImageGallery2 imageUrls={imageUrls}/>
        
        <Text style={styles.description}>Description : Image Description</Text>
        <Text style={styles.description}>Manufacture Year: Image2 Description</Text>
        <Text style={styles.description}>Price/Rate: Image3 Description</Text>
        <Text style={styles.description}>Seller Details: Image4 Description</Text>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover', // You can adjust this as needed
    borderRadius: 10, // Add border radius for rounded corners
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default MyImageComponent;

//<Image source={{ uri: "https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg" }} style={styles.image} />