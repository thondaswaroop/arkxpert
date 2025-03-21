import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, RefreshControl, Alert, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../Resources';
import { httpService } from '../../services/api/Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import { useLoader } from '../../utils/common/LoaderContext';
import { loggerService } from '../../utils/CommonUtils';
import NetInfo from '@react-native-community/netinfo';
import { createTables, getQuestionsByTopicId, getTopicById, insertQuestions, insertTopic } from '../../services/sqlite/SQLiteService';
import { downloadImage } from '../../services/ImageService';
import { GlobalColors } from '../../styles/Colors';

const { width } = Dimensions.get('window');

const ViewTopic = ({ route }: any) => {
  const { title, id } = route.params;
  const [topic, setTopic] = useState<any>({});
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: title,headerStyle: {
        backgroundColor: GlobalColors.colors.themeBlack, // Set toolbar background color
    },
    headerTintColor: GlobalColors.colors.white
    });
    getTopic();
  }, [title]);

  const getTopic = async () => {
    showLoader();
    const netInfo = await NetInfo.fetch();
    setIsOffline(!netInfo.isConnected);

    try {
      if (netInfo.isConnected) {
        const result: any = await httpService.post('viewTopic', { 'id': id });
        loggerService('default', 'View Topic Service', result);

        const localImagePath = await downloadImage(result.topics.image);
        const topicWithLocalImage = {
          ...result.topics,
          localImagePath,
          categorytitle: result.topics.categorytitle || null,
          questionsLength: result.topics.questionsLength || 0,
          totalScore: result.topics.totalScore || 0
        };

        setTopic(topicWithLocalImage);
        await insertTopic(topicWithLocalImage);


        // Fetch questions from API
        const result1: any = await httpService.get(`getAllQuestions&topic=${id}`);
        const formattedQuestions = result1.questions.map((question: any) => ({
          id: question.id,
          title: question.title,
          options: [question.option_1, question.option_2, question.option_3, question.option_4],
          correctAnswer: parseInt(question.correct) - 1,
          explanation: question.explanation,
          link: question.link,
          score: parseInt(question.score),
          story: question.story,
          topic: id // Add topic ID for referencing
        }));

        await insertQuestions(formattedQuestions);
        console.log('Inserted Questions:', formattedQuestions); // Log inserted questions
        const questionsFromDB = await getQuestionsByTopicId(id);
        console.log('Fetched Questions from DB:', questionsFromDB); // Log fetched questions

      } else {
        const topicFromDB: any = await getTopicById(id);
        if (topicFromDB) {
          setTopic(topicFromDB);
        } else {
          Alert.alert("Error", "No data available offline.");
        }
      }
    } catch (error) {
      loggerService('error', 'Error fetching topic', error);
      Alert.alert("Error", "Failed to load topic data.");
    } finally {
      hideLoader();
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getTopic();
    setRefreshing(false);
  }, []);

  const startQuiz = () => {
    if (isOffline) {
      Alert.alert(
        "No Internet Connection",
        "Your Points cannot be stored if you are in offline mode. But still you can play it offline. Do you want to continue?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              const data = { 'title': title, id: id };
              navigation.navigate('QuizStartScreen', data);
            },
          },
        ]
      );
    } else {
      const data = { 'title': title, id: id };
      navigation.navigate('QuizStartScreen', data);
    }
  };

  return (
    <ImageBackground
      source={{ uri: `file://${topic.localImagePath}` }} style={globalStyles.topicViewImage}
      style={globalStyles.mainImageBgContainer}
      resizeMode="cover"
    >
      <View style={globalStyles.overlay}>
        <ScrollView style={globalStyles.padding}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={globalStyles.topicViewImageContainer}>
            {topic.localImagePath ? (
              <Image source={{ uri: `file://${topic.localImagePath}` }} style={globalStyles.topicViewImage} />
            ) : (
              topic.image && (
                <Image source={{ uri: topic.image }} style={globalStyles.topicViewImage} />
              )
            )}
          </View>

          <View style={[globalStyles.padding, globalStyles.mBottom20]}>
            <Text style={[globalStyles.h2, globalStyles.whiteColor, { fontSize: 20 }]}>{topic.title}</Text>

            <Text style={[globalStyles.mTop20, globalStyles.h2, globalStyles.whiteColor]}>
              <Icon name="badge-account-horizontal" size={20} color="gold" /> &nbsp;
              <Text>{topic.categorytitle}</Text>
            </Text>
            <View style={[{ justifyContent: 'space-between', flexDirection: 'row' }]}>
              <Text style={[globalStyles.mTop10, globalStyles.h2, globalStyles.whiteColor]}>
                Quiz Questions: {topic.questionsLength}
              </Text>
              <Text style={[globalStyles.mTop10, globalStyles.h2, globalStyles.whiteColor]}>
                Score: {topic.totalScore}
              </Text>
            </View>
            <Text style={[globalStyles.mTop10, globalStyles.normalFont, globalStyles.whiteColor]}>{topic.description}</Text>

          </View>
        </ScrollView>
        <View style={globalStyles.bottomEmptySpace}></View>
        <View style={[globalStyles.buttomButton, globalStyles.padding, globalStyles.fullWidth]}>
          <TouchableOpacity style={[globalStyles.borderButton, globalStyles.textCenter, { width: '60%' }]} onPress={startQuiz}>
            <Text style={globalStyles.whiteColor}>Let's Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ViewTopic;
