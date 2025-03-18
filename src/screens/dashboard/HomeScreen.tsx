// src/screens/HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { globalStyles } from '../../Resources';
import CommonHeader from '../../components/Header';
import LeaderBoard from '../../components/LeaderBoard';
import ImageSlideArea from '../../components/ImageSlider';
import { httpService } from '../../services/api/Api';
import { loggerService, TruncatedText } from '../../utils/CommonUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLoader } from '../../utils/common/LoaderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
    openDatabase,
    createTables,
    insertCategories,
    insertBanners,
    getCategories,
    getBanners
} from '../../services/sqlite/SQLiteService';
import { downloadImage, getImageURI } from '../../services/ImageService';
const HomeScreen = () => {
    const navigation: any = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [bannerData, setBannersData] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const [userRank, setUserRank] = useState(0);
    const [todayScore, setTodayScore] = useState(0);
    const [overallScore, setOverallScore] = useState(0);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        await openDatabase();
        await createTables();
        await fetchInitialData();
    };

    const fetchInitialData = async () => {
        const netInfo = await NetInfo.fetch();
        setIsOffline(!netInfo.isConnected);

        if (netInfo.isConnected) {
            await fetchAllDataFromAPI();
        } else {
            await loadAllDataFromSQLite();
        }

        await getUserLeaderBoard();
    };

    const fetchAllDataFromAPI = async () => {
        showLoader(); // Show loader at the start
        try {
            const [categoriesResult, bannersResult]: any = await Promise.all([
                httpService.get('categories'),
                httpService.get('banners'),
            ]);

            const categoriesFromAPI = categoriesResult.categories;
            const bannersFromAPI = bannersResult.banners;

            // Download images for categories
            const categoriesWithLocalImages: any = await Promise.all(categoriesFromAPI.map(async (category: any) => {
                const imageUrl = category.image;
                // if (isOffline) {
                //     const localImagePath = await downloadImage(imageUrl);
                //     return { ...category, localImagePath };
                // } else {
                //     const localImagePath = imageUrl;
                //     return { ...category, localImagePath };
                // }
                const localImagePath = downloadImage(imageUrl);
                return { ...category, localImagePath };
            }));

            setCategories(categoriesWithLocalImages);
            await insertCategories(categoriesWithLocalImages);

            // Download images for banners
            const bannersWithLocalImages: any = await Promise.all(bannersFromAPI.map(async (banner: any) => {
                const imageUrl = banner.img;
                return { ...banner, imageUrl };
            }));

            setBanners(bannersWithLocalImages);
            setBannersData(bannersFromAPI)

        } catch (error) {
            loggerService('error', 'Error fetching data from API', error);
        } finally {
            hideLoader(); // Hide loader only after all images are downloaded
        }
    };

    const loadAllDataFromSQLite = async () => {
        showLoader();
        try {
            const categoriesFromDB: any = await getCategories();
            setCategories(categoriesFromDB);

        } catch (error) {
            loggerService('error', 'Error loading data from SQLite', error);
        } finally {
            hideLoader();
        }
    };

    const onScreenFocus = useCallback(() => {
        getUserLeaderBoard();
    }, []);

    useFocusEffect(onScreenFocus);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const netInfo = await NetInfo.fetch();
        setIsOffline(!netInfo.isConnected);
        if (netInfo.isConnected) {
            await fetchAllDataFromAPI();
        } else {
            await loadAllDataFromSQLite();
        }
        await getUserLeaderBoard();
        setRefreshing(false);
    }, []);

    const getUserLeaderBoard = async () => {
        showLoader();
        try {
            let userId = await AsyncStorage.getItem('UserId');

            // Fetch user rank from API
            const result: any = await httpService.post('getUserRank', { "userID": userId });
            loggerService('default', 'Rank Information Fetch', result);

            // Update state with the fetched rank
            setUserRank(result.rank);
            setTodayScore(result.todayScore);
            setOverallScore(result.overallScore);

            // Save the rank information locally
            await AsyncStorage.setItem('UserRank', JSON.stringify({
                rank: result.rank,
                todayScore: result.todayScore,
                overallScore: result.overallScore,
            }));

        } catch (error) {
            loggerService('error', 'Rank Information Error', error);

            // If there's an error, try to load the last saved rank from local storage
            const savedRank:any = await AsyncStorage.getItem('UserRank');
            const { rank, todayScore, overallScore } = JSON.parse(savedRank);
            if (!rank) {
                setUserRank(rank);
                setTodayScore(todayScore);
                setOverallScore(overallScore);
            } else {
                // If no saved rank exists, set defaults
                setUserRank(0);
                setTodayScore(0);
                setOverallScore(0);
            }
        } finally {
            hideLoader();
        }
    };

    const openCategory = (category: any) => {
        const data = { 'title': category.title, id: category.id };
        navigation.navigate('Categories', data);
    };

    return (
        <View style={globalStyles.mainContainer}>
            <CommonHeader />
            <View style={globalStyles.padding}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    {
                        isOffline ? (
                            // <View style={globalStyles.mTop10}>
                            //     <ImageSlideArea images={banners} isOffline={isOffline} />
                            // </View>
                            <></>
                        ) : (
                            <View style={globalStyles.mTop10}>
                                <ImageSlideArea images={banners} isOffline={isOffline} bannerData={bannerData} />
                            </View>
                        )
                    }
                    <View style={globalStyles.mTop20}>
                        <LeaderBoard
                            rank={userRank}
                            totalScore={overallScore}
                            todayScore={todayScore}
                        />
                    </View>
                    <Text style={globalStyles.sectionTitle}>Your Power Picks</Text>
                    <View style={globalStyles.categoriesContainer}>
                        {categories.map((category: any, index) => (
                            <TouchableOpacity
                                key={index}
                                style={globalStyles.categoryCard}
                                onPress={() => openCategory(category)}
                            >
                                <Image
                                    source={{ uri: isOffline && category.localImagePath ? `file://${category.localImagePath}` : category.image }}
                                    style={globalStyles.categoryImage}
                                    onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
                                />
                                <View style={globalStyles.categoryInfo}>
                                    <Text style={globalStyles.categoryTitle}>{category.title}</Text>
                                    <TruncatedText text={category.description} limit={120} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={globalStyles.bottomEmptySpace}></View>
                </ScrollView>
            </View>
        </View>
    );
};

export default HomeScreen;
