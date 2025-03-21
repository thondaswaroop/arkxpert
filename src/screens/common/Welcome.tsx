import React, { useRef } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { globalStyles, imagesBucket } from '../../Resources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setIntroDisplayed } from '../../redux/slice/AuthSlice';
import { loggerService } from '../../utils/CommonUtils';

const Welcome = () => {
    const navigation = useNavigation();
    const sliderRef = useRef(null); // Create a ref for AppIntroSlider

    const dispatch = useDispatch();

    const handleDoneButtonPress = async () => {
        try {
            await AsyncStorage.setItem('introDisplayed', 'true');
            dispatch(setIntroDisplayed());
            loggerService('default', 'Intro Screen Done Button Press', 'Intro marked as displayed');

        } catch (error) {
            loggerService('error', 'Intro Screen Done Button Press Error', error);
        }
    };

    const createAccount = async () => {
        await AsyncStorage.setItem('introDisplayed', 'true');
        dispatch(setIntroDisplayed());
        navigation.navigate('SignUp');
    }

    return (
        <ImageBackground
            source={imagesBucket.backgroundImage}
            style={globalStyles.mainImageBgContainer}
            resizeMode="cover"
        >
            <View style={globalStyles.overlay}>
                <View style={[globalStyles.buttomButton, globalStyles.fullWidth, globalStyles.padding]}>
                    <View style={[globalStyles.mBottom20]}>
                        <View style={globalStyles.mTop100}>
                            <Image
                                source={imagesBucket.logo}
                                style={[globalStyles.leftImage, globalStyles.mTop50,globalStyles.logoMainImage]}
                            />
                            <Text style={[globalStyles.whiteColor, globalStyles.h2, { paddingLeft: 0, paddingVertical: 10 }]}>
                                A guided journey of spiritual transformation.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[globalStyles.playButton, globalStyles.mBottom10]} onPress={handleDoneButtonPress}>
                        <Text style={globalStyles.whiteColor}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.borderButton, globalStyles.mTop10, globalStyles.mBottom20]} onPress={createAccount}>
                        <Text style={globalStyles.whiteColor}>Create Your Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Welcome;
