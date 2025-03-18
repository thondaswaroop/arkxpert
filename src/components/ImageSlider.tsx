import React, { useCallback } from 'react';
import { Alert, View, Dimensions, StyleSheet, Linking } from 'react-native';
import { ImageSlider } from 'react-native-image-slider-banner';
import { loggerService } from '../utils/CommonUtils';
import { AppEnvironment } from '../constants/Global';

const { width: screenWidth } = Dimensions.get('window');

interface ImageData {
  img: string;
  localImagePath?: string; // Add optional local path
}

interface ImageSlideAreaProps {
  images: ImageData[];
  bannerData: any;
  isOffline: boolean;
}

const ImageSlideArea: React.FC<ImageSlideAreaProps> = ({ images, isOffline, bannerData }) => {
  const displayImages = images.map(image => ({
    img: isOffline && image.localImagePath ? `file://${image.localImagePath}` : image.img,
  }));

  const clickImage = async (images: any, index: any) => {
    const bannerURL = bannerData[index]?.url || '';
    loggerService('bannerURL', clickImage.name, bannerURL);

    if (bannerURL) {
      try {
        await Linking.openURL(bannerURL);
      } catch (error) {
        Alert.alert('Error', 'Unable to open the link.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageSlider
        data={
          displayImages.length > 0
            ? displayImages
            : [{ img: `${AppEnvironment.BaseUrl}images/logo.png` }]
        }
        autoPlay={true}
        timer={4000}
        onClick={(images, index) => clickImage(images, index)}
        preview={false}
        caroselImageStyle={styles.image} // Ensures proper display of images
        closeIconColor="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth, // Matches the screen width
    height: screenWidth * 0.7, // Adjust height as needed (60% of screen width)
  },
  image: {
    width: screenWidth, // Matches the screen width
    height: screenWidth * 0.7, // Matches container height
    resizeMode: 'contain', // Ensures the full image fits without cutting
  },
});

export default ImageSlideArea;
