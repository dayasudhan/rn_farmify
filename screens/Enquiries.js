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
  Button
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/utils';
import { useAuth } from '../AuthContext';

const ExpandableComponent = ({ item, onClickFunction }) => {
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
    <View>
      <KeyboardAwareScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.8} onPress={onClickFunction} style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item.item.image_urls[0] }} style={styles.itemImage} />
            <Text style={styles.headerText}>
              {item.item.name}, {item.item.price}, {item.item.address}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ height: layoutHeight, overflow: 'hidden' }}>
          <Text style={styles.text}>
            {item.name}, {item.address}, {item.city}, {item.phone}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button title="Call Seller" onPress={() => handleCallPress(item.item.phone)} />
            <Button title="Call Buyer" onPress={() => handleCallPress(item.phone)} />
          </View>
          <View style={styles.separator} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const App = ({ navigation }) => {
  const [listDataSource, setListDataSource] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [data, setData] = useState([]);
  const { loggedIn, logIn, logOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const getEnquiries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(BASE_URL + 'enquiries');
      if (response.status === 200) {
        console.log("! 403");
        setData(response.data);
        setListDataSource(response.data);
      } else {
        console.log("else 403");
        setData(null);
        setListDataSource(null);
      }
      console.log(response);
    } catch (error) {
      console.log("else error 403");
      console.log(error);
      // handle error here
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getEnquiries();
  }, [loggedIn]);

  const handleLogoutSubmit = async () => {
    console.log("handleLogoutSubmit")
    try {
      await axios.get(BASE_URL + 'logout').then(response => {
        setTimeout(() => {
          console.log("logged out successfully", response)
          setData(null);
          setListDataSource(null);
          logOut();
          navigation.navigate('Home');
        }, 1000);
      })
        .catch(error => {
          console.error("error", error);
        });
    } catch (error) {
      console.error("error", error);
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

  return(
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={styles.titleText}>Enquiry List</Text>
          <TouchableOpacity onPress={() => handleLogoutSubmit()}>
            <Text style={{ textAlign: 'center', justifyContent: 'center' }}>LogOut</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : listDataSource && listDataSource.length ? (
          <ScrollView>
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
          <Text>No enquiries available</Text>
        )}
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
