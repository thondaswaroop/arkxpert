import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { imagesBucket } from '../Resources';
import { Image } from 'react-native';
import { AppEnvironment } from '../constants/Global';

const CommonHeader = () => {
    return (
        < View style={styles.header} >
            <Image
                source={imagesBucket.icon} // Replace with your logo
                style={styles.logo}
            />
            <Text style={styles.headerText}>{AppEnvironment.AppName}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333', // Adjust as per your design
        height: 70,
        paddingHorizontal: 10,
        zIndex: 1000,
        elevation: 5,
    },
    logo: {
        width: 30,
        height: 30,
        marginLeft:10
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default CommonHeader