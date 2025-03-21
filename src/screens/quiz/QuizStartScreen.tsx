import { View, Text, TouchableOpacity, Alert, BackHandler, Modal, Image, ImageBackground, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import QuestionComponent from '../../components/QuestionComponent';
import { globalStyles, imagesBucket } from '../../Resources';
import { useLoader } from '../../utils/common/LoaderContext';
import { httpService } from '../../services/api/Api';
import { loggerService } from '../../utils/CommonUtils';
import ExplanationModal from '../../components/ExplanationModal';
import NetInfo from '@react-native-community/netinfo';
import { insertQuestions, getQuestionsByTopicId } from '../../services/sqlite/SQLiteService';
import { GlobalColors } from '../../styles/Colors';

const QuizStartScreen = ({ route }: any) => {
  const { title, id } = route.params;
  const navigation: any = useNavigation();

  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [questions, setQuestions] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'wrong' }>({});
  const { showLoader, hideLoader } = useLoader();
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [link, setlink] = useState<string>('');
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);

  const getQuestions = async (topicid: any) => {
    showLoader();
    const netInfo = await NetInfo.fetch(); // Check network status
    try {
      if (netInfo.isConnected) {
        // Fetch questions from API
        const result: any = await httpService.get(`getAllQuestions&topic=${topicid}`);
        console.log('resultresult', result);
        const formattedQuestions = result.questions.map((question: any) => ({
          id: question.id,
          title: question.title,
          options: [question.option_1, question.option_2, question.option_3, question.option_4],
          correctAnswer: parseInt(question.correct) - 1,
          explanation: question.explanation,
          link: question.link,
          score: parseInt(question.score),
          story: question.story,
          topic: topicid // Add topic ID for referencing
        }));
        console.log('formattedQuestions', formattedQuestions);

        setQuestions(formattedQuestions);
        await insertQuestions(formattedQuestions); // Store questions in SQLite
      } else {
        // Load questions from SQLite if offline
        const questionsFromDB: any = await getQuestionsByTopicId(topicid);
        console.log('offlinequestions', questionsFromDB);
        if (questionsFromDB && questionsFromDB.length > 0) {
          const formattedQuestions = questionsFromDB.map((question: any) => ({
            id: question.id,
            title: question.title,
            options: [question.option_1, question.option_2, question.option_3, question.option_4],
            correctAnswer: parseInt(question.correct) - 1,
            explanation: question.explanation,
            link: question.link,
            score: parseInt(question.score),
            story: question.story,
            topic: topicid // Add topic ID for referencing
          }));
          console.log('formattedQuestions', formattedQuestions);

          setQuestions(formattedQuestions);
        } else {
          Alert.alert("Error", "No questions available offline.");
        }
      }
    } catch (error) {
      loggerService('error', 'Questions Fetching error', error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    let toolBarTitle: any = title;
    if (title.length >= 30) {
      toolBarTitle = title.substring(0, 30) + '..';
    }
    navigation.setOptions({
      title: toolBarTitle, headerStyle: {
        backgroundColor: GlobalColors.colors.themeBlack, // Set toolbar background color
      },
      headerTintColor: GlobalColors.colors.white,
      headerLeft: () => (''), // Remove back button
      tabBarStyle: { display: 'none' },
      headerRight: () => (
        <TouchableOpacity onPress={showExitConfirmation} style={globalStyles.headerButton}>
          <Image source={imagesBucket.closeIcon} style={globalStyles.iconImage} />
        </TouchableOpacity>
      ),
    });
    getQuestions(id); // Call to fetch questions
  }, [title, id]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);

    // Save the selected answer in the current question
    setQuestions((prevQuestions: any) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        userSelectedAnswer: index,
      };
      return updatedQuestions;
    });
  };

  const displayFeedbackAndModal = (currentQuestion: any) => {
    const feedbackUpdate: any = {};
    let result: 'correct' | 'wrong' = 'wrong';

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + currentQuestion.score);
      setCorrectAnswersCount(correctAnswersCount + 1);
      feedbackUpdate[selectedAnswer] = 'correct';
      result = 'correct';
    } else {
      feedbackUpdate[selectedAnswer] = 'wrong';
      feedbackUpdate[currentQuestion.correctAnswer] = 'correct';
    }

    setFeedback(feedbackUpdate);
    setAnswerResult(result);
    showLoader();

    setTimeout(() => {
      setExplanation(currentQuestion.explanation);
      setStory(currentQuestion.story);
      setlink(currentQuestion.link);
      setModalVisible(true);
      hideLoader();
    }, 1000);
  };

  const handleNextQuestion = () => {
    const currentQuestion: any = questions[currentQuestionIndex];

    if (selectedAnswer !== null && currentQuestion) {
      displayFeedbackAndModal(currentQuestion);


      setlink(currentQuestion.link);

      // Update the question with the selected answer
      setQuestions((prevQuestions: any) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          userSelectedAnswer: selectedAnswer,
        };
        return updatedQuestions;
      });
    }
  };

  const handleContinue = () => {
    setModalVisible(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback({});
    } else {
      navigation.navigate('QuizResults', {
        score: score,
        correctAnswers: correctAnswersCount,
        totalQuestions: questions.length,
        title: title,
        id: id,
        questions: questions
      });
    }
  };

  const showExitConfirmation = () => {
    Alert.alert(
      "Exit Quiz",
      "Do you really want to exit the quiz? All progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setQuestions([]);
            setSelectedAnswer(null);
            setCurrentQuestionIndex(0);
            setScore(0);
            navigation.goBack();
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
        // Define the function for back press behavior
        const onBackPress = () => {
            showExitConfirmation();
            return true; // Prevent default back behavior
        };

        // Hide the bottom tab bar when this screen is focused
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' } // Hide only the tab bar, preserve other styles
        });

        // Add back button listener
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        // Cleanup when the screen loses focus
        return () => {
            // Restore the tab bar when the screen is no longer focused, maintaining its styles
            navigation.getParent()?.setOptions({
                tabBarStyle: { display: 'flex', backgroundColor: '#404040' } // Ensure background color is preserved
            });

            // Remove the back button listener
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
    }, [navigation]) // Re-run the effect if the navigation object changes
);




  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <ImageBackground
      source={imagesBucket.backgroundImage}
      style={globalStyles.mainImageBgContainer}
      resizeMode="cover"
    >
      <View style={globalStyles.overlay}>
        <ScrollView style={globalStyles.padding}>
          <View style={globalStyles.padding}>
            <View style={[globalStyles.content, globalStyles.mTop10]}>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={globalStyles.mBottom20}>
                  {/* <Text style={[globalStyles.h1, globalStyles.themeTextColor]}>
                    {score} 🪙
                  </Text> */}
                </View>
                <View style={globalStyles.mBottom20}>
                  <Text style={[globalStyles.h1, globalStyles.themeTextColor]}>
                    {score} 🪙
                  </Text>
                </View>
              </View>

              <QuestionComponent
                question={currentQuestion.title}
                options={currentQuestion.options}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswerSelect}
                feedback={feedback}
                questionInfo={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
              />
              <View style={globalStyles.mTop20}>
                <TouchableOpacity onPress={handleNextQuestion} style={globalStyles.borderButton}>
                  <Text style={[globalStyles.smallButtonText, globalStyles.whiteColor]}>NEXT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ExplanationModal
            visible={modalVisible}
            link={link}
            onClose={() => setModalVisible(false)}
            explanation={explanation}
            story={story}
            result={answerResult}
            onContinue={handleContinue}
          />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default QuizStartScreen;
