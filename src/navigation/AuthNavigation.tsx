import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import Intro from '../screens/common/Intro';
import { Text, View } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust this path to your store setup
import { setIntroDisplayed } from '../redux/slice/AuthSlice';
import Welcome from '../screens/common/Welcome';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const dispatch = useDispatch();

  // Get isIntroDisplayed from the Redux store
  const isIntroDisplayed = useSelector((state: RootState) => state.userInfo.isIntroDisplayed);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const introDisplayed = await AsyncStorage.getItem('introDisplayed');
      if (introDisplayed !== null) {
        dispatch(setIntroDisplayed());
        setIsFirstLaunch(false);
      } else {
        setIsFirstLaunch(true);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isIntroDisplayed ? (
        // <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Welcome" component={Welcome} />
      ) : (
        <Stack.Screen name="SignIn" component={SignIn} />
      )}
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
