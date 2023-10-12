import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import card from './screens/card.js'
import seller from './screens/InputScreen.js'
import enquiries from './screens/Enquiries.js'
import ImagePicker from './screens/ImagePicker.js'
import itemDetail from './screens/itemDetail.js'
import EnquiryInput from './screens/EnquiryInput.js'
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Feed"
        component={card}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Sell"
        component={seller}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ImagePicker"
        component={ImagePicker}
        options={{
          tabBarLabel: 'ImagePicker',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
        />
      <Tab.Screen
        name="Enquiry List"
        component={enquiries}
        options={{
          tabBarLabel: 'Enquiry List',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
        
      />
      <Tab.Screen
        name="Item Detail"
        component={itemDetail}
        options={{
          tabBarLabel: 'Detail',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
     <NavigationContainer>
     <Stack.Navigator initialRouteName="Tabs">
       <Stack.Screen name="Farmify" component={MyTabs} />
       <Stack.Screen name="itemDetail" component={itemDetail} /> 
       <Stack.Screen name="enquiryInput" component={EnquiryInput} /> 
     </Stack.Navigator>
   </NavigationContainer>
  );
}
