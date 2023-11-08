import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        {imageUrls && imageUrls.map((url, index) => (
          <View
            key={index}
            style={{
              marginRight: 1, // Adjust the margin between thumbnails
              width: screenWidth / 6, // Display 4 thumbnails per row
            }}>
            <TouchableOpacity onPress={() => setCurrentIndex(index)}>
              <Image source={{ uri: url }} style={styles.thumbnail} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.mainImageContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImageContainer: {
    alignItems: 'center',
  },
  image: {
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'white',
    padding: 10,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width - 20,
  },
  thumbnail: {
    width: '100%',
    height: '100%', // Adjust the thumbnail height
    borderRadius: 5,
  },
  iconContainer: {
    position: 'absolute',
    top: (Dimensions.get('window').width - 20) / 2,
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
