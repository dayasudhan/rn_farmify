import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Formik } from 'formik';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validationSchema } from './../utils/validationEnquiry';
import { styles } from './../utils/styles';
import axios from 'axios';
import BASE_URL from './../utils/utils';

const URL = BASE_URL + 'seller/enquiry';

const EnquiryInput = ({ navigation,route }) => {
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  const onSubmitHandler = (values) => {
    console.log('Input values:', values);
   values['itemId'] = route.params.data; 
    axios
      .post(URL, values)
      .then((response) => {
        console.log('response1', response);
        console.log('response2', response?.data?.id);
        setTimeout(() => {
          setResponseText(
            `Enquiry Inserted Successfully With Id : ${
              response?.data?.id
            } Seller will contact you soon`
          );
          setShowModal(true);
        }, 1000);
      })
      .catch((error) => {
        console.error('Axios Error:', error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />

      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: 'Devraj',
            phone: '956629075',
            address: 'Kuruva, Honnali, Davangere, Karnataka',
          }}
        
          onSubmit={(values) => {
            onSubmitHandler(values);
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <KeyboardAwareScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Details</Text>

                <TextInput
                  style={styles.input}
                  value={values.name}
                  placeholder="Contact Name.."
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                <Text style={{ color: 'red' }}>{errors.name}</Text>
              </View>
              <View style={styles.formGroup}>
                <TextInput
                  style={styles.input}
                  value={values.phone}
                  placeholder="Contact Phone.."
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                />
                <Text style={{ color: 'red' }}>{errors.phone}</Text>
              </View>

              <TextInput
                style={styles.input}
                value={values.address}
                placeholder="Address.."
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                multiline={true}
                numberOfLines={4}
              />
              <Text style={{ color: 'red' }}>{errors.address}</Text>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>SUBMIT</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          )}
        </Formik>

        <Modal
          animationType="slide"
          transparent={false}
          visible={showModal}
          onRequestClose={closeModal}
        >
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

export default EnquiryInput;
