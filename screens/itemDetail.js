import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share,Linking  } from 'react-native';
import ImageGallery from './ImageGallery';

const MyImageComponent = ({ navigation, route }) => {
  const receivedData = route.params.data;

  console.log("receivedData", receivedData);
  const hyphenIndex = receivedData.address.indexOf(' - ');

  let address;
  if (hyphenIndex !== -1) {
    // If a hyphen is present, split the address and take the first part
    address = receivedData.address.substring(0, hyphenIndex);
  } else {
    // If no hyphen is present, use the entire address
    address = receivedData.address;
  }
  function handleSubmit() {
    
    navigation.navigate('EnquiryInput', { data: receivedData.id });
  }

  function handleShare() {
    Share.share({
      message: `Have a look at this item: ${receivedData.name} http://13.232.42.12:3006/buyer/product/item?id=22`,
    });
  }
  function handleCallDealer() {
    const phone = receivedData?.dealer?.phone;
    console.log("phone",phone)
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  }
  const openWhatsApp = () => {
    // Replace '1234567890' with the phone number or WhatsApp ID of the contact or group
    const phoneNumber = '9148843555';
  
    // Replace 'Hello, WhatsApp!' with the message you want to send
    const  message= `Have a look at this item: ${receivedData.name} http://13.232.42.12:3006/buyer/product/item?id=22`;
  
    // Create a WhatsApp URL with the phone number and message
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
  
    // Open the WhatsApp app
    Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp opened: ', data);
      })
      .catch(() => {
        console.error('An error occurred while opening WhatsApp.');
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{receivedData.name}</Text>
        <ImageGallery imageUrls={receivedData.image_urls} />

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.description}>{receivedData.description}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Manufacture Year:</Text>
            <Text style={styles.description}>{receivedData.makeYear}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Price/Rate:</Text>
            <Text style={styles.description}>{receivedData.price}</Text>
          </View>
          {/* <View style={styles.tableRow}>
            <Text style={styles.label}>Seller Address:</Text>
            <Text style={styles.description}>{address}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Seller City/Village:</Text>
            <Text style={styles.description}>{receivedData.city}</Text>
          </View> */}
          <View style={styles.tableRow}>
            <Text style={styles.label}>Seller District:</Text>
            <Text style={styles.description}>{receivedData.district},{receivedData.state}</Text>
          </View>
         
        {/* <View style={styles.tableRow}>
          <Text style={styles.label}>Dealer Phone:</Text>
          <Text style={styles.description}>{receivedData?.dealer?.phone}</Text>

        </View> */}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enquiry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.callButton} onPress={handleCallDealer}>
            <Text style={styles.buttonText}>Call Dealer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
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
    
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
  },
  callButton: {
    backgroundColor: "#2980b9", // Green color for call button
    padding: 10,
    borderRadius: 5,
  },
  table: {
    // width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 1,
    marginHorizontal: 50,
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 1,
  },
  tableCell: {
    flex: 1,
    flexWrap: 'wrap', // Allow text to wrap to the next line
  },
  label: {
    fontWeight: 'bold',
  },


  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});

export default MyImageComponent;
