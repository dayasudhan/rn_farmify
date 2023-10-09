import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo package

const ImageGalleryWithIcons = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // You can use currentIndex to fetch data or perform other actions when the index changes.
  }, [currentIndex]);

  const handlePrevClick = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex(Math.min(currentIndex + 1, imageUrls.length - 1));
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {imageUrls.map((url, index) => (
          <View
            key={index}
            style={{
              marginRight: 100, // Adjust the margin as needed
              width: screenWidth, // Set the width to the screen width
            }}>
            <Image source={{ uri: imageUrls[currentIndex] }} style={styles.image} />
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.icon}
                onPress={handlePrevClick}
                disabled={currentIndex === 0}>
                <Ionicons name="ios-arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={handleNextClick}
                disabled={currentIndex === imageUrls.length - 1}>
                <Ionicons name="ios-arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 10,
  },
  image: {
    borderRadius: 10,
    borderWidth: 10, // Add a border around the image
    borderColor: 'white', // Border color
    padding: 10, // Add padding inside the border
    width: Dimensions.get('window').width, // Set the image width to the screen width
    height: Dimensions.get('window').width - 20, // You can adjust the image height as needed
  },
  iconContainer: {
    position: 'absolute',
    top: ( Dimensions.get('window').width -20 )/ 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ImageGalleryWithIcons;