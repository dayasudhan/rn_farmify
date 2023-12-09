import React from 'react';
import { Share, Button, View, Image, StyleSheet } from 'react-native';

const ShareComponent = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Hi, please use this app',
        url: 'https://play.google.com/store/games?device=phone',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(`Shared via ${result.activityType}`);
        } else {
          // shared
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-screen Image */}
      <Image
        source={require('../assets/invite.png')}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
      
      {/* Share App Button */}
      <View style={styles.buttonContainer}>
        <Button onPress={onShare} title="Share App" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default ShareComponent;
