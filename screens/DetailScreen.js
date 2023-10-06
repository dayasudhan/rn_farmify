import React from 'react';
import { View, Text } from 'react-native';

function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      {/* Add more details here */}
    </View>
  );
}

export default DetailScreen;