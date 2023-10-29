import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button,  
  TouchableOpacity,StyleSheet,SafeAreaView,Switch,Modal,Image ,FlatList} from 'react-native';
import { Formik } from 'formik';
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validationSchema } from "./../utils/validation";
import { styles } from "./../utils/styles";
import axios from 'axios';
import BASE_URL from './../utils/utils' 
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
const URL = BASE_URL + "upload";
const INITURL = BASE_URL + "states";

const InputScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [images, setImages] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    // Fetch states and districts from the backend API here
    // Replace the following with your actual API endpoint
    axios.get(INITURL)
      .then((response) => {
        console.log("inside states",response)
        setStates(response.data?.states); // Assuming the API response is an array of state options
        setDistricts(response.data?.districts);
      })
      .catch((error) => {
        console.error('Error fetching states:', error);
      });
  }, []);

  const onSubmitHandler = (values) => {
    if (images.length === 0) {
      alert('No images selected , Please select one or more images to upload.');
      return;
    }
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`images`, {
        uri: image,
        type: 'image/jpeg',
        name: `image${index}.jpg`,
      });
    });

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const value = values[key];
        formData.append(key, value);
      }
    }
    console.log('Login form values:', values,formData);
    axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log("response1",response);
      console.log("response2",response?.data?.id);
      setTimeout(() => {
        setResponseText(`Customer Inserted Successfully With Id : ${response?.data?.id}`); // Set the response text to be shown in the modal
        setShowModal(true); // Show the modal
      }, 1000); // Delay of 1 second
    })
    .catch(error => {
      console.error("error",error);
    });
  };
  const closeModal = () => {
    setShowModal(false);
    // location.reload();
  };
  const openModal = () => {
    setShowModal(true);
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log("result",result);

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  return (
    <>
    <SafeAreaView style={styles.topSafeArea} />

    <StatusBar style="light" />

    <SafeAreaView style={styles.container}>

      <Formik
        initialValues={{
          name: "Devraj",
          phone: "956629075",
          address: "Kuruva,Honnali,Davangere,Karnataka",
          email: "dayasudhankg@gmail.com",
          landMark:"",
          city:"Shimoga",
          item_name:"",
          item_year:"2020",
          item_price:"25000",
          item_place:"",
          description:"Sample description",
          image:"",
          state:"",
          district:""
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmitHandler(values)}
      >
        {({ handleChange, handleSubmit,handleBlur, values, errors, touched }) => (
          <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          >
            {/* <View style={styles.formGroup}> */}
            <Text style={styles.label}>Item Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name..." 
              onChangeText={handleChange('item_name')}
              value={values.item_name}
            />
             <Text style={{ color: "red" }}>{errors.item_name}</Text>

            <TextInput
                 style={styles.input}
                 value={values.item_year}
                 placeholder="Item Manufacture Year"
                 onChangeText={handleChange("item_year")}
               />
            <Text style={{ color: "red" }}>{errors.item_year}</Text>
             <TextInput
                  style={styles.input}
                  value={values.item_price}
                  placeholder="Item Rate/Price.."
                  onChangeText={handleChange("item_price")}
                  autoCapitalize="none"
                />
                 <Text style={{ color: "red" }}>{errors.item_price}</Text>
                <TextInput
                  style={styles.input}
                  value={values.description}
                  placeholder="Description.."
                  onChangeText={handleChange("description")}
                 
                  autoCapitalize="none"
                />
                 <Text style={{ color: "red" }}>{errors.description}</Text>
                
              <View style={styles.formGroup}>
                <Text style={styles.label}>Seller Details</Text>

                <TextInput
                  style={styles.input}
                  value={values.name}
                  placeholder="Contact Name.."
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
             <Text style={{ color: "red" }}>{errors.name}</Text>

              </View>
              <View style={styles.formGroup}>
                <TextInput
                  style={styles.input}
                  value={values.phone}
                  placeholder="Contact Phone.."
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                />
                 <Text style={{ color: "red" }}>{errors.phone}</Text>
              </View>


              <TextInput
                  style={styles.input}
                  value={values.city}
                  placeholder="Village/City..."
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                />
              <Text style={{ color: "red" }}>{errors.city}</Text>
              
                 <TextInput
                  style={styles.input}
                  value={values.address}
                  placeholder="Address.."
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  multiline={true} // Set to true for multiline input
                  numberOfLines={4} // Specify the number of lines to display (optional)
                />
                <Text style={{ color: "red" }}>{errors.address}</Text>
              <Text>Select State</Text>
                    <Picker
                      selectedValue={values.state}
                      onValueChange={handleChange("state")}
                    >                    
                    {states.length>0 && states.map((state) => (
                      <Picker.Item key={state} label={state} value={state} />
                    ))}
                    </Picker>
                <Text>Select District</Text>
                    <Picker
                      selectedValue={values.district}
                      onValueChange={handleChange("district")}
                    >                    
                    {districts[values.state] &&  districts[values.state].length > 0 &&  districts[values.state].map((district) => (
                      <Picker.Item key={district} label={district} value={district} />
                    ))}
                    </Picker>
                     
                      <Button title="Pick images from the gallery" onPress={pickImage} />
                      <FlatList
                      data= {images}
                      keyExtractor={(item) => item}
                      // numColumns={2}
                      renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
                          <TouchableOpacity onPress={() => deleteImage(index)}>
                            <Text style={{ color: 'red', marginLeft: 10 }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
              
            />
             
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          </KeyboardAwareScrollView>
          
        )}
      </Formik>
      <Modal   animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={closeModal}>
         <View style={{ flex: 1, justifyContent: 'center' }}>
         <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
         <Text>{responseText}</Text>
         <Button title="Close" onPress={closeModal} />
         </View>
         </View>
      </Modal>
      
    </SafeAreaView>
    </>
  );
};


export default InputScreen;