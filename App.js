import React from 'react';
import 'react-native-gesture-handler'
import {NavigationContainer, StackActions} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'


import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import Map from "./components/map.js"
import CheckIn from "./components/checkIn.js"

const Navi = () => {
  const MaterailTopTab = createMaterialTopTabNavigator();

  return (
    <MaterailTopTab.Navigator>
      <MaterailTopTab.Screen name="Where I am" component={Map} />
      <MaterailTopTab.Screen name="CheckIn History" component={CheckIn}/>
    </MaterailTopTab.Navigator>
  );
};

const App=  () => {
  const Stack = createStackNavigator();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerTitleAlign : "center",
          headerStyle : {
            height : 50,
          },
          headerTitleStyle: {
            fontSize : 13,
          },
          headerShown : false, // if some design error in notch design , change this
        }}>
        <Stack.Screen
            name = "CheckIn"
            component = {Navi}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({

});

export default App;
