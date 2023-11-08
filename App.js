import 'react-native-gesture-handler'; // Required for gesture-based navigation
import React  from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons,Entypo  } from '@expo/vector-icons';
import card from './screens/card.js'
import seller from './screens/InputScreen.js'
import enquiries from './screens/Enquiries.js'
import itemDetail from './screens/itemDetail.js'
import EnquiryInput from './screens/EnquiryInput.js'
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Image, StyleSheet,Text,Button ,TouchableOpacity } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
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
      {/* <Tab.Screen
         name="Enquiries"
        component={enquiries}
        options={{
          tabBarLabel: 'Enquiries',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="inbox" color={color} size={26} />
          ),
        }}
        
      /> */}

    </Tab.Navigator>
  );
}


const CustomDrawerContent = () => {
  return (
    <View style={styles.drawerHeader}>
      <Image
        source={require('./assets/ic_launcher.png')}
        style={styles.drawerImage}
      />
    </View>
  );
};

function DrawerContent({ navigation }) {
  const navigationState = useNavigationState((state) => state);
  
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const isScreenActive = (routeName) => {
    if (navigationState) {
      return navigationState.routes[navigationState.index].name === routeName;
    }
    return false;
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
        <Text style={styles.drawerText}>Enquiries</Text>
      </TouchableOpacity>
    </View>
    
  );

}
const DrawerNavigator = () => {
  return (
      <Drawer.Navigator 
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Home12"
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
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
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
});
export default function App() {
  return (
     <NavigationContainer>
     <DrawerNavigator/>
   </NavigationContainer>
  );
}
