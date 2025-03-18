import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Image, Animated, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { globalStyles, imagesBucket } from '../../Resources';
import { AppEnvironment } from '../../constants/Global';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
    const navigation = useNavigation();
    const isUserLoggedIn = useSelector((state: any) => state.userInfo.isUserLoggedIn); // Get login status from Redux


    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current; // Initial scale is slightly reduced
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const fadeAnim3 = useRef(new Animated.Value(0)).current;
    const fadeAnim4 = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current; // Button starts off-screen

    const getStarted = () => {

    };

    useEffect(() => {
        Animated.stagger(300, [
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(fadeAnim2, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim3, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeAnim4, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Automatically navigate after a delay
        const timeout = setTimeout(getStarted, 5000);

        // Clean up the timeout if the component unmounts
        return () => clearTimeout(timeout);
    }, [fadeAnim, scaleAnim, fadeAnim2, fadeAnim3, fadeAnim4, slideAnim]);

    return (
        // <ImageBackground
        //             source={imagesBucket.backgroundImage}
        //             style={globalStyles.introBg}
        //             resizeMode="cover"
        //         >
        <View style={globalStyles.introBg}>
            <View style={globalStyles.logoContainer} />
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                <Image
                    source={imagesBucket.logo}
                    resizeMode='center'
                    style={globalStyles.logoImage}
                />
            </Animated.View>
        </View>
        // </ImageBackground>
    );
}

export default Splash;
