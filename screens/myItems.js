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
  Modal
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/utils';
import { useAuth } from '../AuthContext';

const ExpandableComponent = ({ item, onClickFunction,getMyItems }) => {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showConfirmationModal = () => {
    setIsModalVisible(true);
  };
  const hideConfirmationModal = () => {
    setIsModalVisible(false);
  };
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
  const [idToMarkAsSold, setIdToMarkAsSold] = useState(null);

// Inside the modal, you can have "Yes" and "No" buttons
const handleConfirmation = () => {
  hideConfirmationModal();
  if (idToMarkAsSold) {
    // Proceed with marking the item as sold
    const url = BASE_URL + 'dealer/markitemsold/' + idToMarkAsSold;
    axios
      .patch(url)
      .then((response) => {
        console.log('Data saved successfully:', response.data);
        getMyItems();
        // Remove the marked item from the listDataSource
       // setListDataSource((prevList) => prevList.filter((item) => item.id !== idToMarkAsSold));
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      })
      .finally(() => {
        // Reset the idToMarkAsSold after completing the operation
        setIdToMarkAsSold(null);
      });
  }
};

const handleCancellation = () => {
  hideConfirmationModal();
  // Reset the idToMarkAsSold if the user cancels the operation
  setIdToMarkAsSold(null);
};
  const markSoldItem = (id) => {
    showConfirmationModal();
    setIdToMarkAsSold(id);
    // 'data.value' contains the selected value
    // console.log('markSoldItem:', id);
    // const url  = BASE_URL + 'dealer/markitemsold/' + id;
    // console.log("url",url)
    // axios
    // .patch(url)
    // .then((response) => {
    //   console.log('Data saved successfully:', response.data);
    // })
    // .catch((error) => {
    //   console.error('Error saving data:', error);
    // });
    // //onClickFunction()
    // getMyItems()

  };
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={onClickFunction} style={styles.cardHeader}>
        <View style={styles.cardHeaderContent}>
          <Image source={{ uri: item.image_urls[0] }} style={styles.itemImage} />
          <Text style={styles.cardHeaderText}>
            {item.name}, {item.price}, {item.city}
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
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Manufacture Year:</Text>
            <Text style={styles.description}>{item.makeYear}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Price/Rate:</Text>
            <Text style={styles.description}>{item.price}</Text>
          </View>
            <View style={styles.tableRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.description}>{item.address}</Text>
          </View> 
          <View style={styles.tableRow}>
            <Text style={styles.label}>City/Village:</Text>
            <Text style={styles.description}>{item.ity}</Text>
          </View> 
         <View style={styles.tableRow}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.description}>{item.district},{item.state}</Text>
          </View> 
        </View>
      
        <View style={styles.buttonContainer}>
          <Button title="Call Seller" onPress={() => handleCallPress(item.phone)} />
          <Button title="Mark Sold" onPress={() => markSoldItem(item.id)} />
        </View>
        <View style={styles.separator} />
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={hideConfirmationModal}
        >
            
        <View style={styles.modalContainer}>
            <Text>Are you sure you want to mark this item as sold?</Text>
            <View style={styles.buttonContainer}>
            <Button title="Yes" style={styles.button} onPress={handleConfirmation} />
            <View style={{ marginHorizontal: 30 }} />
            <Button title="No" style={styles.button} onPress={handleCancellation} />
            </View>
        </View>
</Modal>
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

  const getItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(BASE_URL + 'dealer/items');
      if (response.status === 200) {
        
        setListDataSource(response.data);
       // console.log("response.data",response.data)
      } else {
        setListDataSource([]);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
const initItems = (item)=>{
    console.log("initItems------------------",item.id)
    setListDataSource((prevList) => prevList.filter((i) => i.id !== item.id));
}
  useEffect(() => {
    getItems();
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
        <Text style={styles.titleText}>Item List</Text>
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
              getMyItems = {()=>{initItems(item)}}
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
  button: {
    padding: 20,
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
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
