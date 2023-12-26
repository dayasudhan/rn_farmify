import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
  Image,
  Linking,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/utils';
import { useAuth } from '../AuthContext';

const ExpandableComponent = ({ item, onClickFunction }) => {
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  const handleCallPress = (phone) => {
    Linking.openURL(`tel:${phone}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone call is not available on this device');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={onClickFunction} style={styles.cardHeader}>
        <View style={styles.cardHeaderContent}>
          <Image source={{ uri: item.item.image_urls[0] }} style={styles.itemImage} />
          <Text style={styles.cardHeaderText}>
            {item.item.name}, {item.item.price}, {item.item.city}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: layoutHeight, overflow: 'hidden' }}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.heading_label}>Item Details:</Text>
        </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.description}>{item.item.description}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Manufacture Year:</Text>
            <Text style={styles.description}>{item.item.makeYear}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Price/Rate:</Text>
            <Text style={styles.description}>{item.item.price}</Text>
          </View>
            <View style={styles.tableRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.description}>{item.item.address}</Text>
          </View> 
          <View style={styles.tableRow}>
            <Text style={styles.label}>City/Village:</Text>
            <Text style={styles.description}>{item.item.city}</Text>
          </View> 
         <View style={styles.tableRow}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.description}>{item.item.district},{item.item.state}</Text>
          </View> 
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.heading_label}>Buyer Details:</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.description}>{item.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Seller Address:</Text>
            <Text style={styles.description}>{item.address}</Text>
          </View>
        </View>
      
        <View style={styles.buttonContainer}>
          <Button title="Call Seller" onPress={() => handleCallPress(item.item.phone)} />
          <Button title="Call Buyer" onPress={() => handleCallPress(item.phone)} />
        </View>
        <View style={styles.separator} />
      </View>
    </View>
  );
};

const App = ({ navigation }) => {
  const [listDataSource, setListDataSource] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);


  const [isLoading, setIsLoading] = useState(false);
  const { loggedIn, logOut } = useAuth();

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const getEnquiries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(BASE_URL + 'dealer/enquiries');
      if (response.status === 200) {
        setListDataSource(response.data);
        console.log("response.data",response.data)
      } else {
        setListDataSource([]);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEnquiries();
  }, [loggedIn]);

  const handleLogoutSubmit = async () => {
    try {
      await axios.get(BASE_URL + 'logout');
      // setData(null);
      setListDataSource([]);
      logOut();
      navigation.navigate('Buy');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    if (multiSelect) {
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false),
      );
    }
    setListDataSource(array);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>Enquiry List</Text>
        <TouchableOpacity onPress={() => handleLogoutSubmit()}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : listDataSource && listDataSource.length ? (
        <ScrollView style={styles.scrollView}>
          {listDataSource.map((item, key) => (
            <ExpandableComponent
              key={item.name + key}
              onClickFunction={() => {
                updateLayout(key);
              }}
              item={item}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noEnquiriesText}>No enquiries available</Text>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  heading_label: {
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'blue',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: '#F5FCFF',
    margin: 10,
    borderRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    padding: 20,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  cardHeaderText: {
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
  cardText: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  noEnquiriesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#606070',
    marginTop: 20,
  },
  table: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 5,
    width: '100%',
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
  description: {
    fontSize: 15,
    marginTop: 5,
    // flex: 1, 
    // flexWrap: 'wrap'
  },
});
