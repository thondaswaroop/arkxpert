// src/components/Loader.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import { useLoader } from '../utils/common/LoaderContext';

const Loader: React.FC = () => {
    const { isLoading } = useLoader();
    if (!isLoading) return null;

    return (
        <View style={styles.loaderContainer}>
            <LoaderKit style={styles.loader} name='BallSpinFadeLoader' />
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background to see loader
        zIndex: 1000, // Ensure it's on top of other components
        elevation: 1000, // For Android, zIndex is sometimes not enough
    },
    loader: {
        width: 50,
        height: 50,
    },
});

export default Loader;
