import React from 'react';
import { View,  Text, StyleSheet ,TouchableOpacity,Modal} from 'react-native';

import ImageGallery from './ImageGallery';
const imageUrls = [
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-457982009-1695640635314-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-457982009-1695640635314-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg',
  'https://farmifyequipments.s3.amazonaws.com/thumbnail-457982009-1695640635314-.jpeg',
];

const MyImageComponent = ({ navigation,route }) => {
  const receivedData = route.params.data; 
  
  console.log("receivedData",receivedData)

  function handleSubmit()
  {
    navigation.navigate('enquiryInput',{ data: receivedData.id });
  }
  return (
    <View style={styles.container}>
      
     
      <View style={styles.infoContainer}>
      <Text style={styles.title}>{receivedData.name}</Text>
     
        
        <Text style={styles.description}>Description : {receivedData.description}</Text>
        <Text style={styles.description}>Manufacture Year: {receivedData.makeYear}</Text>
        <Text style={styles.description}>Price/Rate: {receivedData.price}</Text>
        <Text style={styles.description}>Seller Details: {receivedData.address1},{ receivedData.city},{ receivedData.state}</Text>
       
           <ImageGallery imageUrls={receivedData.image_urls}/>
           <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Contact/Enquiry</Text>
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
  button: {
    marginTop: 20,
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default MyImageComponent;

//<Image source={{ uri: "https://farmifyequipments.s3.amazonaws.com/thumbnail-665949102-1695639571579-.jpeg" }} style={styles.image} />