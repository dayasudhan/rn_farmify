import 'react-native-gesture-handler'; // Required for gesture-based navigation
import React from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons,Entypo  } from '@expo/vector-icons';
import card from './screens/card.js'

import{AuthProvider } from './AuthContext';
import seller from './screens/InputScreen.js'
import enquiries from './screens/Enquiries.js'
import itemDetail from './screens/itemDetail.js'
import EnquiryInput from './screens/EnquiryInput.js'
import ShareComponent from './screens/ShareComponent.js'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from './screens/DrawerContent.js';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={card} />
      <Stack.Screen name="ItemDetail" component={itemDetail} /> 
      <Stack.Screen name="Enquiries" component={EnquiryInput} /> 
    </Stack.Navigator>
  );
}
const SellerStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sell" component={seller} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
      barStyle={{ backgroundColor: 'white' ,height: 70  }}
    >
      <Tab.Screen
        name="Home"
        component={MainStackNavigator}
        options={{
          //tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Sell"
        component={SellerStackNavigator}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tractor-variant" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const DrawerNavigator = () => {
  return ( 
      <Drawer.Navigator 
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Buy"
        component={MyTabs}
        options={{
          title: 'Farmify',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={focused ? 'blue' : 'black'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Enquiries"
        component={enquiries}
        options={{
          title: 'Enquiries',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'share-variant' : 'share-variant-outline'}
              size={size}
              color={focused ? 'blue' : 'black'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ShareComponent"
        component={ShareComponent}
        options={{
          title: 'ShareComponent',
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'inbox' : 'inbox-outline'}
              size={size}
              color={focused ? 'blue' : 'black'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
      <AuthProvider>
        <NavigationContainer>
          <DrawerNavigator/>
        </NavigationContainer>
      </AuthProvider>
  );
}
