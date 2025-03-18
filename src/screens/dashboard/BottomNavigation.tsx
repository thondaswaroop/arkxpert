// Home.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';  // Main home content
import CategoryScreen from './CategoryScreen';  // Categories screen
import Search from './Search';  // Search screen
import Profile from './Profile';
import ViewTopic from '../quiz/ViewTopic';
import QuizStartScreen from '../quiz/QuizStartScreen';
import QuizResults from '../quiz/QuizResults';
import ReviewAnswersScreen from '../quiz/ReviewAnswersScreen';
import EditProfile from './EditProfile';

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
    return (
        <Stack.Navigator initialRouteName='HomeScreen'>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Categories" component={CategoryScreen} />
            <Stack.Screen name="ViewTopic" component={ViewTopic} />
            <Stack.Screen name="QuizStartScreen" component={QuizStartScreen} />
            <Stack.Screen name="QuizResults" component={QuizResults} />
            <Stack.Screen name="ReviewAnswersScreen" component={ReviewAnswersScreen} />
        </Stack.Navigator>
    );
};

const SearchNavigation = () => {
    return (
        <Stack.Navigator initialRouteName='SearchMain'>
            <Stack.Screen name="SearchMain" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="Categories" component={CategoryScreen} />
            <Stack.Screen name="ViewTopic" component={ViewTopic} />
            <Stack.Screen name="QuizStartScreen" component={QuizStartScreen} />
            <Stack.Screen name="QuizResults" component={QuizResults} />
            <Stack.Screen name="ReviewAnswersScreen" component={ReviewAnswersScreen} />
        </Stack.Navigator>
    );
};

const ProfileNavigation = () => {
    return (
        <Stack.Navigator initialRouteName='ProfileMain'>
            <Stack.Screen name="ProfileMain" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: true,headerTitle:'Edit Your Profile' }} />
        </Stack.Navigator>
    );
};

export { HomeNavigation, SearchNavigation, ProfileNavigation };
