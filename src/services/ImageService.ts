import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { loggerService } from '../utils/CommonUtils';

// Helper function to ensure URL has a URI scheme
const ensureUrlHasScheme = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
        loggerService('default', 'URL missing scheme, prepending https://', url);
        return `https://${url}`;
    }
    return url;
};

// Function to download and save an image locally
export const downloadImage = async (imageUrl: string): Promise<string> => {
    console.log(imageUrl, "Original Image URL");

    if (!imageUrl) {
        loggerService('error', 'Invalid imageUrl', imageUrl);
        return imageUrl;  // Return original URL if imageUrl is invalid
    }

    // Ensure the imageUrl has a URI scheme
    const validatedUrl = ensureUrlHasScheme(imageUrl);
    console.log(validatedUrl, "Validated Image URL");

    const { dirs } = RNFetchBlob.fs;
    const fileName = validatedUrl.split('/').pop()?.trim() || `image_${Date.now()}`;
    const localPath = `${dirs.DocumentDir}/images/${fileName}`;
    console.log(localPath, "Local Path for Saving Image");

    try {
        // Ensure the images directory exists
        const dirExists = await RNFetchBlob.fs.exists(`${dirs.DocumentDir}/images`);
        if (!dirExists) {
            await RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/images`);
        }

        // Download the image
        const res = await RNFetchBlob.config({
            fileCache: true,
            path: localPath,
        }).fetch('GET', validatedUrl);

        console.log(res, "Download Response");

        loggerService('default', 'Image downloaded to', res.path());

        return res.path();
    } catch (error) {
        loggerService('error', 'Image download failed', error);
        return imageUrl; // Fallback to online URL if download fails
    }
};

// Function to get image URI based on online/offline status
export const getImageURI = (isOffline: boolean, localPath: string, remoteUrl: string): string => {
    if (isOffline && localPath) {
        return Platform.OS === 'android' ? `file://${localPath}` : localPath;
    }
    return remoteUrl;
};
