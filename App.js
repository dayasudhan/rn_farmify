import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons,Entypo  } from '@expo/vector-icons';
import card from './screens/card.js'
import seller from './screens/InputScreen.js'
import enquiries from './screens/Enquiries.js'
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
      barStyle={{ backgroundColor: 'white' ,height: 70  }}
    >
      <Tab.Screen
        name="Home"
        component={card}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Sell"
        component={seller}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tractor-variant" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
         name="Enquiries"
        component={enquiries}
        options={{
          tabBarLabel: 'Enquiries',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="inbox" color={color} size={26} />
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
       <Stack.Screen name="ItemDetail" component={itemDetail} /> 
       <Stack.Screen name="Enquiries" component={EnquiryInput} /> 
     </Stack.Navigator>
   </NavigationContainer>
  );
}
