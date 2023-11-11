import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button,  
  TouchableOpacity,StyleSheet,SafeAreaView,Switch,Modal,Image ,FlatList} from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validationSchema } from "./../utils/validation";
import { styles } from "./../utils/styles";
import axios from 'axios';
import {BASE_URL} from './../utils/utils' 
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../AuthContext';

const URL = BASE_URL + "upload";
const INITURL = BASE_URL + "states";
import { Feather } from '@expo/vector-icons';
const InputScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [images, setImages] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [geoResult,setGeoResult]=useState(null);
  const { location} = useAuth();
  function rearrangeArray(items, firstitem) {
    if(!items)
    {
      return null;
    }
    if (items.includes(firstitem)) {
      return items;
    }
    const remainingitems = items?.filter(item => item !== firstitem);
    const rearrangeditems = [firstitem, ...remainingitems];
    console.log("rearrangeArray",rearrangeditems)
    return rearrangeditems;
  }
  useEffect(() => {
    (async () => {
      console.log("useeffect1")
      initStates();
      console.log("useeffect2")
      if(!location)
       return
      const {latitude,longitude} = location;
      console.log("location coords",latitude,longitude)
      const apiKey = '04a5800be4bb465bb63d271f5b3941e4';
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0 && data.results[0].components['country'] === 'India') {
            const districtInfo = data.results[0].components;
            console.log("districtInfo",districtInfo,districtInfo['country'])
            const district  = districtInfo?.state_district?.replace(' District', '');
            const address= `${districtInfo.county}, ${data.results[0].formatted.replace("unnamed road,", "")}`;
            setGeoResult([{
              address:address,
              state: districtInfo.state,
              latitude,
              longitude,
              postcode:districtInfo.postcode,
              district: district,
              city:districtInfo['suburb']?districtInfo['suburb']:districtInfo['village']?districtInfo['village']:districtInfo['town']
            }])
            //  console.log("geoResult",geoResult),
            // console.log("districtInfo",districtInfo)
             axios.get(INITURL)
             .then((response) => {
               console.log("response.data?.districts",response.data?.districts)
               console.log("response.data?.states",response.data?.states)
               console.log("district",district)
              const districts =response.data?.districts;
              districts[districtInfo.state] = rearrangeArray(response.data?.districts[districtInfo.state],district);
               setStates(rearrangeArray(response.data?.states,districtInfo.state)); // Assuming the API response is an array of state options
               console.log("districts",districts)
               if(districts)
                 setDistricts(districts);
             })
             .catch((error) => {
               console.error('Error fetching states:', error);
             });
          } else {
            console.error('District information not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching district information:', error);
        }).finally(()=>{
          console.log("finally")
          initStates();
        })

    })();

  }, []);
  const initStates = () =>{
    console.log("initStates")
  axios.get(INITURL)
        .then((response) => {
          console.log("inside states",response)
          setStates(response.data?.states); // Assuming the API response is an array of state options
          setDistricts(response.data?.districts);
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
        });
  }
  const onSubmitHandler = (values) => {
    if (isSubmitting) {
      console.log("onSubmitHandler isSubmitting true");
      return; // Disable button if already submitting
    }
    console.log("onSubmitHandler");
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
    if(geoResult)
    {
      formData.append("latitude", geoResult[0].latitude);
      formData.append("longitude", geoResult[0].longitude);
      formData.append("postcode", geoResult[0].postcode);
    }
    console.log(' form values:', values,formData);
    setIsSubmitting(true); 
    console.log("awat isSubmitting",isSubmitting)
    axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      // console.log("response1",response);
      // console.log("response2",response?.data?.id);

        setResponseText(`Item uploaded Successfully With Id : ${response?.data?.id}`); // Set the response text to be shown in the modal
        setShowModal(true); // Show the modal
    })
    .catch(error => {
      console.error("error",error);
    }).finally(()=>{
      setIsSubmitting(false);    
      console.log("values",values)
      values.item_name = "";
       values.item_year = "";
       values.item_price = "";
      values.description = "";

      setImages([]); // Reset images after the submission is complete   
    })
  };
  const closeModal = () => {
    setShowModal(false);

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
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const newImages = [...images, result.assets[0].uri];
        setImages(newImages);
      }
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

   
      <Formik
        initialValues={{
          name: "",
          phone: "",
          address: geoResult?geoResult[0].address:"",
          email: "",
          landMark:"",
          city:geoResult?geoResult[0].city:"",
          item_name:"",
          item_year:"",
          item_price:"",
          item_place:"",
          description:"",
          image:"",
          state:geoResult?geoResult[0].state:"",
          district:geoResult?geoResult[0].district:"",
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmitHandler(values)}
      >
        {({ handleChange, handleSubmit,handleBlur , values, errors, touched }) => (
          <KeyboardAwareScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          >
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
                     
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={pickImage} style={{
                              marginTop: 5,
                              backgroundColor: "#3498db",
                              padding: 10,
                              borderRadius: 5,
                              flexDirection: 'row'
                            }}>
                      <Feather name="image" size={20} color="white" />
                      <Text style={styles.buttonText}>Image from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePhoto} style={{
                            marginTop: 5,
                            backgroundColor: "#3498db",
                            padding: 10,
                            borderRadius: 5,
                            flexDirection: 'row'
                          }}>
                      <Feather name="camera" size={20} color="white" />
                      <Text style={styles.buttonText}>Take a Photo</Text>
                    </TouchableOpacity>
                  </View>
                      <FlatList
                      data= {images}
                      keyExtractor={(item) => item}
                      renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
                          <TouchableOpacity onPress={() => deleteImage(index)}>
                            <Text style={{ color: 'red', marginLeft: 10 }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
            />
             
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
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
      
    </>
  );
};


export default InputScreen;