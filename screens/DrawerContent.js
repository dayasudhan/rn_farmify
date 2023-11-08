import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import axios from 'axios';
import BASE_URL from '../utils/utils';

const DrawerContent = ({ navigation }) => {
  const navigationState = useNavigationState((state) => state);
  const auth = useAuth();
  const { loggedIn, logIn } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigateToScreen = (screenName) => {
    if (screenName === 'Enquiries' && !loggedIn) {
      setModalVisible(true);
    } else {
      navigation.navigate(screenName);
    }
  };

  const isScreenActive = (routeName) => {
    if (navigationState) {
      return navigationState.routes[navigationState.index].name === routeName;
    }
    return false;
  };

  const handleLoginSubmit = async () => {
    try {
      const loginData = { 'username': username, 'password': password };
      await axios.post(BASE_URL + 'login', loginData).then(response => {
        setTimeout(() => {
          logIn();
          setModalVisible(!modalVisible);
          navigation.navigate('Enquiries');
        }, 1000);
      }).catch(error => {
        alert("Not authenticated");
      });
    } catch (error) {
      alert("Not authenticated");
    }
  };

  return (
    <View>
      <Text>Farmify</Text>
      <Image
        source={require('./assets/ic_launcher.png')}
        style={styles.drawerImage}
      />

      <TouchableOpacity
        style={[
          styles.drawerItem,
          isScreenActive('Home') && styles.activeDrawerItem,
        ]}
        onPress={() => navigateToScreen('Home')}
      >
        <MaterialCommunityIcons name="home" size={30} color="black" />
        <Text style={styles.drawerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.drawerItem,
          isScreenActive('Enquiries') && styles.activeDrawerItem,
        ]}
        onPress={() => navigateToScreen('Enquiries')}
      >
        <MaterialCommunityIcons name="inbox" size={30} color="black" />
        <Text style={styles.drawerText}>{auth && auth.loggedIn ? 'Enquiries' : 'Dealer Login'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.drawerItem,
          isScreenActive('ShareComponent') && styles.activeDrawerItem,
        ]}
        onPress={() => navigateToScreen('ShareComponent')}
      >
        <MaterialCommunityIcons name="share-variant" size={30} color="black" />
        <Text style={styles.drawerText}> Share It</Text>
      </TouchableOpacity>

      {/* Modal for login */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Dealer log in to continue</Text>
            <TextInput
              style={[styles.input, { width: '100%', maxWidth: 400 }]}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={[styles.input, { width: '100%', maxWidth: 400 }]}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#2196F3' }]}
                onPress={() => {
                  handleLoginSubmit();
                }}
              >
                <Text style={styles.textStyle}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={() => {
                  setModalVisible(false);
                  setUsername('');
                  setPassword('');
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  drawerText: {
    marginLeft: 20,
    fontSize: 18,
  },
  activeDrawerItem: {
    backgroundColor: 'lightblue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '40%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  drawerImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
});

export default DrawerContent;
