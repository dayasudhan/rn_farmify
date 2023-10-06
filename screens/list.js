import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { styles } from "./../utils/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const data = [
  { id: '1', name: 'Item 1', expanded: false },
  { id: '2', name: 'Item 2', expanded: false },
  { id: '3', name: 'Item 3', expanded: false },
  { id: '4', name: 'Item 4', expanded: false },
  { id: '5', name: 'Item 5', expanded: false },
  // Add more items as needed
];

const ExpandableListView = () => {
  const [listData, setListData] = useState(data);

  const toggleItem = (id) => {
    const updatedListData = listData.map((item) => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    setListData(updatedListData);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleItem(item.id)}>
      <View style={styles2.item}>
        <Image
          source={require('./../assets/profile.jpg')} // Replace with the path to your image
          style={styles2.itemImage}
        />
        <View style={styles2.itemContent}>
          <Text style={styles2.itemText}>{item.name}</Text>
          {item.expanded && <Text>Additional information here</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>


    <StatusBar style="light" />

    <SafeAreaView style={styles.container}>
   
    
      <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          >
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
   </KeyboardAwareScrollView>
    </SafeAreaView>
    </>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ExpandableListView;