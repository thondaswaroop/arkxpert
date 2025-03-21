import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { globalStyles } from '../../Resources';
import { httpService } from '../../services/api/Api';
import { useNavigation } from '@react-navigation/native';
import { useLoader } from '../../utils/common/LoaderContext';
import { loggerService } from '../../utils/CommonUtils';
import NetInfo from '@react-native-community/netinfo';
import { createTables,  getTopics, insertTopic } from '../../services/sqlite/SQLiteService';
import { downloadImage } from '../../services/ImageService';
import { GlobalColors } from '../../styles/Colors';

// Component definition
const CategoryScreen = ({ route }: any) => {
    const { title, id } = route.params; // Destructure title and id from route params
    const [topics, setTopics] = useState([]); // State to hold topics
    const navigation: any = useNavigation(); // Navigation hook
    const [refreshing, setRefreshing] = useState(false); // Refresh state
    const { showLoader, hideLoader } = useLoader(); // Loader context
    const [isOffline, setIsOffline] = useState(false); // Offline state

    // Effect hook for initializing the screen
    useEffect(() => {
        navigation.setOptions({ title,headerStyle: {
            backgroundColor: GlobalColors.colors.themeBlack, // Set toolbar background color
        },
        headerTintColor: GlobalColors.colors.white }); // Set screen title
        initializeScreen(); // Call function to initialize screen data
    }, [title]);

    // Function to initialize screen
    const initializeScreen = async () => {
        await createTables(); // Create necessary tables in SQLite
        const netInfo = await NetInfo.fetch(); // Check network status
        setIsOffline(!netInfo.isConnected); // Set offline state based on connectivity
        if (netInfo.isConnected) {
            await fetchTopicsOnline(); // Fetch topics online if connected
        } else {
            await loadTopicsOffline(); // Load topics from SQLite if offline
        }
    };

    // Function to fetch topics from the API
    const fetchTopicsOnline = async () => {
        const data = { category: id }; // Prepare data for API request
        showLoader(); // Show loader
        try {
            const result: any = await httpService.post('topics', data); // Make API call
            if (result && result.topics) {
                const topicsWithLocalImages: any = await Promise.all(result.topics.map(async (topic: any) => {
                    const imageUrl = topic.image; // Get image URL from topic
                    const localImagePath = await downloadImage(imageUrl); // Download image and get local path
                    return {
                        ...topic,
                        localImagePath,
                        categorytitle: topic.categorytitle || null, // Ensure categorytitle is included
                        questionsLength: topic.questionsLength || 0, // Default to 0 if not provided
                        totalScore: topic.totalScore || 0 // Default to 0 if not provided
                    }; // Return topic with local image path
                }));
                setTopics(topicsWithLocalImages); // Update topics state
                await insertTopic(topicsWithLocalImages); // Insert topics into SQLite
            } else {
                setTopics([]); // Clear topics if none are found
            }
        } catch (error) {
            loggerService('error', 'Error fetching topics from API', error); // Log error
        } finally {
            hideLoader(); // Hide loader
        }
    };

    // Function to load topics from SQLite
    const loadTopicsOffline = async () => {
        showLoader(); // Show loader
        try {
            const topicsFromDB: any = await getTopics(); // Get topics from SQLite
            setTopics(topicsFromDB); // Update topics state
        } catch (error) {
            loggerService('error', 'Error loading topics from SQLite', error); // Log error
        } finally {
            hideLoader(); // Hide loader
        }
    };

    // Function to handle pull-to-refresh action
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true); // Set refreshing state
        const netInfo = await NetInfo.fetch(); // Check network status
        setIsOffline(!netInfo.isConnected); // Set offline state based on connectivity
        if (netInfo.isConnected) {
            await fetchTopicsOnline(); // Fetch topics online if connected
        } else {
            await loadTopicsOffline(); // Load topics from SQLite if offline
        }
        setRefreshing(false); // Reset refreshing state
    }, []);

    // Function to navigate to quiz screen
    const openQuiz = (topic: any) => {
        const data = { title: topic.title, id: topic.id }; // Prepare data for navigation
        navigation.navigate('ViewTopic', data); // Navigate to quiz screen
    };

    // Calculate item width based on screen size
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth / 2) - 20; // Set item width

    // Render component
    return (
        <View style={globalStyles.mainContainer}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {topics.map((topic: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                width: itemWidth,
                                marginBottom: 20,
                                backgroundColor: '#fff',
                                margin: 10,
                                borderRadius: 8,
                            }}
                            onPress={() => openQuiz(topic)}
                        >
                            <Image
                                source={{ uri: isOffline && topic.localImagePath ? `file://${topic.localImagePath}` : topic.image }}
                                style={{ height: 280, borderRadius: 8 }}
                                onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
                            />
                            <View style={globalStyles.mTop10}>
                                <Text style={[globalStyles.p, globalStyles.bold, globalStyles.themeTextColor,globalStyles.h3]}>{topic.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default CategoryScreen;
