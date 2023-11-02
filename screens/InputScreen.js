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
import * as Location from 'expo-location';
const URL = BASE_URL + "upload";
const INITURL = BASE_URL + "states";

const InputScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [images, setImages] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [geoResult,setGeoResult]=useState(null);

  function rearrangeArray(items, firstitem) {
    if (!items.includes(firstitem)) {
      return items;
    }
    const remainingitems = items.filter(item => item !== firstitem);
    const rearrangeditems = [firstitem, ...remainingitems];
    console.log("rearrangeArray",rearrangeditems)
    return rearrangeditems;
  }
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("location",location)
      // setLocation(location);
      const {latitude,longitude} = location.coords;
      // const latitude = "14.1654";
      // const longitude = "75.6681";
      
      const apiKey = '04a5800be4bb465bb63d271f5b3941e4';
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const districtInfo = data.results[0].components;
            const district  = districtInfo.state_district.replace(' District', '');
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
             console.log("districtInfo",districtInfo)
             axios.get(INITURL)
             .then((response) => {
               //console.log("inside stat ",response.data?.districts)
              const districts =response.data?.districts;
              districts[districtInfo.state] = rearrangeArray(response.data?.districts[districtInfo.state],district);
               setStates(rearrangeArray(response.data?.states,districtInfo.state)); // Assuming the API response is an array of state options
               console.log("districts",districts)
               setDistricts(districts);
             })
             .catch((error) => {
               console.error('Error fetching states:', error);
             });
          } else {
            alert('District information not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching district information:', error);
        });
        if(!states)
        {
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
    })();

  }, []);

  const onSubmitHandler = (values) => {
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