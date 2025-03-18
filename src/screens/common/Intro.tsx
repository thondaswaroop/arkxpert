import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../Resources';
import { GlobalColors } from '../../styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIntroDisplayed } from '../../redux/slice/AuthSlice';
import { loggerService } from '../../utils/CommonUtils';

const Intro = () => {
    const navigation = useNavigation();
    const sliderRef = useRef(null); // Create a ref for AppIntroSlider
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const dispatch = useDispatch();

    const slides = [
        {
            key: '1',
            title: '#1 most downloaded book summary app',
            text: 'Achieve your goals by listening and reading the world’s best ideas',
            image: require('../../assets/images/intro1.png'),
            backgroundColor: GlobalColors.colors.primaryWhite,
        },
        {
            key: '2',
            title: 'Learn from the best',
            text: 'Get insights from top experts in their fields',
            image: require('../../assets/images/intro2.png'),
            backgroundColor: GlobalColors.colors.primaryWhite,
        },
        {
            key: '3',
            title: 'Anytime, Anywhere',
            text: 'Access your summaries offline and on the go',
            image: require('../../assets/images/intro3.png'),
            backgroundColor: GlobalColors.colors.primaryWhite,
        },
    ];

    const renderSlide = ({ item }: any) => {
        return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                <Image source={item.image} style={styles.image} />
                <Text style={globalStyles.h1}>{item.title}</Text>
                <Text style={[globalStyles.introParagraph, globalStyles.mTop10]}>{item.text}</Text>
            </View>
        );
    };

    const handleNextButtonPress = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.goToSlide(currentIndex + 1); // Move to the next slide
        }
    };

    const handleDoneButtonPress = async () => {
        try {
          await AsyncStorage.setItem('introDisplayed', 'true');
          dispatch(setIntroDisplayed());
          loggerService('default', 'Intro Screen Done Button Press', 'Intro marked as displayed');
          
        } catch (error) {
            loggerService('error', 'Intro Screen Done Button Press Error', error);
        }
      };
      

    const renderNextButton = () => (
        <TouchableOpacity onPress={handleNextButtonPress} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
    );

    const renderDoneButton = () => (
        <TouchableOpacity onPress={handleDoneButtonPress} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Get Started</Text>
        </TouchableOpacity>
    );

    const handleSlideChange = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppIntroSlider
                ref={sliderRef} // Attach the ref to AppIntroSlider
                renderItem={renderSlide}
                data={slides}
                onSlideChange={handleSlideChange}
                dotStyle={styles.dotStyle}
                activeDotStyle={globalStyles.primaryBackground}
            />
            <View style={globalStyles.buttonWrapper}>
                {currentIndex === slides.length - 1 ? renderDoneButton() : renderNextButton()}
                <Text style={globalStyles.mTop20}>
                    Already have an account? <Text style={globalStyles.link} onPress={() => handleDoneButtonPress()}>Login</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 500,
        height: 300,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginVertical: 20,
    },
    dotStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    activeDotStyle: {
        backgroundColor: GlobalColors.colors.primaryColor,
    },
});

export default Intro;
