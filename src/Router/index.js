import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StartedPage, MovieList, MovieDetail } from "../Pages"


const Stack = createStackNavigator();

const Router = ({ navigation }) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
            name="StartedPage"
            component={StartedPage}
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen
            name="MovieList"
            component={MovieList}
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={{
            headerShown: false,
            }}
        />
    </Stack.Navigator>
  );
};

export default Router;
