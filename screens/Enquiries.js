// Import React
import React, {useEffect, useState} from 'react';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaView,
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/utils';
const ExpandableComponent = ({item, onClickFunction}) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }

    
    
  }, [item.isExpanded]);

  return (
    <View>
        <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          >

      <TouchableOpacity
  activeOpacity={0.8}
  onPress={onClickFunction}
  style={styles.header}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>

    <Image
      source={{ uri: item.item.image_urls[0] }}
      style={styles.itemImage}
    />
        <Text style={styles.headerText}>
      {item.item.name},{item.item.price}, {item.item.phone}
    </Text>
  </View>
</TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        {/*Content under the header of the Expandable List Item*/}
        {/* {item.item.map((item, key) => ( */}
          <TouchableOpacity
            key={item.item.id}
            style={styles.content}
            onPress={
              () => alert('Id: ' + item.item.name + ' val: ' + item.item.phone)
          }>
             
            <Text style={styles.text}>
              {item.name}, {item.address1},{item.city},{item.phone}
            </Text>
            <View style={styles.separator} />
          </TouchableOpacity>
        {/* ))} */}
      </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const App = () => {
  const [listDataSource, setListDataSource] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
        axios.get(BASE_URL + 'seller/enquiries')
        .then(response => {
            if(response.status != 401)
            {
            setData(response.data);
            setListDataSource(response.data);
            }
            else
            {
            setData(null);
            setListDataSource(null);
            }
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    },[]);
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    if (multiSelect) {
      // If multiple select is enabled
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      // If single select is enabled
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] =
             !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false),
      ); 
    }
    setListDataSource(array);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 10}}>
          <Text style={styles.titleText}>Enquiry List</Text>
          <TouchableOpacity
            onPress={() => setMultiSelect(!multiSelect)}>
            <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              {multiSelect
                ? 'Enable Single \n Expand'
                : 'Enalble Multiple \n Expand'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {listDataSource && listDataSource.map((item, key) => (
            <ExpandableComponent
              key={item.name}
              onClickFunction={() => {
                updateLayout(key);
              }}
              item={item}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

//Dummy content to show
//You can also use dynamic data by calling webservice
const CONTENT = [
  {
    isExpanded: false,
    category_name: 'Item 1',
    subcategory: [
      {id: 1, val: 'Sub Cat 1'},
      {id: 3, val: 'Sub Cat 3'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 2',
    subcategory: [
      {id: 4, val: 'Sub Cat 4'},
      {id: 5, val: 'Sub Cat 5'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 3',
    subcategory: [
      {id: 7, val: 'Sub Cat 7'},
      {id: 9, val: 'Sub Cat 9'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 4',
    subcategory: [
      {id: 10, val: 'Sub Cat 10'},
      {id: 12, val: 'Sub Cat 2'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 5',
    subcategory: [
      {id: 13, val: 'Sub Cat 13'},
      {id: 15, val: 'Sub Cat 5'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 6',
    subcategory: [
      {id: 17, val: 'Sub Cat 17'},
      {id: 18, val: 'Sub Cat 8'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 7',
    subcategory: [{id: 20, val: 'Sub Cat 20'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 8',
    subcategory: [{id: 22, val: 'Sub Cat 22'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 9',
    subcategory: [
      {id: 26, val: 'Sub Cat 26'},
      {id: 27, val: 'Sub Cat 7'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 10',
    subcategory: [
      {id: 28, val: 'Sub Cat 28'},
      {id: 30, val: 'Sub Cat 0'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 11',
    subcategory: [{id: 31, val: 'Sub Cat 31'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 12',
    subcategory: [{id: 34, val: 'Sub Cat 34'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 13',
    subcategory: [
      {id: 38, val: 'Sub Cat 38'},
      {id: 39, val: 'Sub Cat 9'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 14',
    subcategory: [
      {id: 40, val: 'Sub Cat 40'},
      {id: 42, val: 'Sub Cat 2'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 15',
    subcategory: [
      {id: 43, val: 'Sub Cat 43'},
      {id: 44, val: 'Sub Cat 44'},
    ],
  },
];