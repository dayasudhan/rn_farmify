import React, { useState } from 'react';
import { View, Text, TextInput, Button,  TouchableOpacity,StyleSheet,SafeAreaView,Switch,Modal } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { validationSchema } from "./../utils/validation";
import { styles } from "./../utils/styles";
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import BASE_URL from './../utils/utils' 
const URL = BASE_URL + "leads";


const InputScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const onSubmitHandler = (values) => {
    console.log('Login form values:', values);
    axios.post(URL, values)
    .then(response => {
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
  const [propertyType, setPropertyType] = useState('Commercial');
  const [serviceFrequency, setServiceFrequency] = useState('Monthly');
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
          image:""
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
             <Text style={{ color: "red" }}>{errors.name}</Text>
            {/* {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
          {/* </View> */}
          {/* <View style={styles.formGroup}> */}
            <TextInput
                 style={styles.input}
                 value={values.item_year}
                 placeholder="Item Manufacture Year"
                 onChangeText={handleChange("item_year")}
                //  onBlur={handleBlur("phone")}
               />
            <Text style={{ color: "red" }}>{errors.item_year}</Text>
             <TextInput
                  style={styles.input}
                  value={values.item_price}
                  placeholder="Item Rate/Price.."
                  onChangeText={handleChange("item_price")}
                  // onBlur={handleBlur("email")}
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
             
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          </KeyboardAwareScrollView>
          
        )}
      </Formik>
       {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
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