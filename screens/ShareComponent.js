import React from 'react';
import { Share, Button, View } from 'react-native';

const ShareComponent = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Hi Please us this app',
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
    <View>
      <Button onPress={onShare} title="Share App" />
    </View>
  );
};

export default ShareComponent;