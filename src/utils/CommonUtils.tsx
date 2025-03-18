
import React from 'react';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../Resources';
import { AppEnvironment } from '../constants/Global';
import Share from 'react-native-share';


interface Props {
    text: string;
    limit: number;
}

const clearSession = () => {
    AsyncStorage.setItem('UserId', '');
}


const loggerService = (type: any, message: any, message1: any, message2: any = '') => {
    if (AppEnvironment.devEnviornment) {
        if (type == 'error') {
            return console.error(message, message1, message2);
        } else {
            return console.log(message, message1, message2);
        }
    }
}

const socialShare = async (image:any, text1:any, text2:any, link:any) => {
    try {
        const shareOptions = {
            title: text1,
            message: `${text1}\n\n${text2}\n\nGet the app here: \n 👇👇👇 \n ${link}\n`,
            // url: image, // The image URL
        };

        const result:any = await Share.open(shareOptions);

    } catch (error:any) {
        // Alert.alert('Error', error.message);
    }
};

const TruncatedText: React.FC<Props> = ({ text, limit }) => {
    const displayText = text.length > limit ? `${text.slice(0, limit)}...` : text;

    return (
        <View>
            <Text style={globalStyles.categoryDescription}>{displayText}</Text>
        </View>
    );
};

export { clearSession, TruncatedText, loggerService, socialShare }

