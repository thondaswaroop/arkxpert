import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation, ProfileNavigation, SearchNavigation } from '../screens/dashboard/BottomNavigation';
import Ficon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#404040' }, // Set bottom bar background color
                tabBarActiveTintColor: '#fff',  // Active tab text/icon color (white)
                tabBarInactiveTintColor: '#909090', // Inactive tab text/icon color (grey)
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigation}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ficon name='home' color={color} size={20} />
                    )
                }}
            />

            <Tab.Screen
                name="Search"
                component={SearchNavigation}  // Keep this if SearchNavigation contains nested screens
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ficon name='account-search' color={color} size={20} />
                    )
                }}
            />


            <Tab.Screen
                name="Profile"
                component={ProfileNavigation}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person" color={color} size={20} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomNavigation;
