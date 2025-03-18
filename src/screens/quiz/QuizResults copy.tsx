import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Alert, BackHandler } from 'react-native';
import { globalStyles, imagesBucket } from '../../Resources'; // Assuming you have global styles
import { GlobalColors } from '../../styles/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { httpService } from '../../services/api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loggerService } from '../../utils/CommonUtils';
import { useLoader } from '../../utils/common/LoaderContext';
import { useToast } from 'react-native-toast-notifications';
import { showToast } from '../../utils/common/ToastUtil';

const QuizResultsScreen = ({ route, navigation }) => {
    const { score, correctAnswers, totalQuestions, title, id, questions } = route.params;
    const [userID, setUserID] = useState(null);
    const toast = useToast();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const id = await AsyncStorage.getItem('UserId');
                setUserID(id);
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };

        fetchUserID();
    }, []);

    const calculateGrade = useMemo(() => {
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        return 'C';
    }, [correctAnswers, totalQuestions]);

    const progressPercentage = useMemo(() => (correctAnswers / totalQuestions) * 100, [correctAnswers, totalQuestions]);

    useEffect(() => {
        navigation.setOptions({
            title: 'Quiz Completed!',
            headerLeft: () => (''), // Empty header left (can customize as needed)
            headerRight: () => (
                <TouchableOpacity onPress={showExitConfirmation} style={globalStyles.headerButton}>
                    <Image source={imagesBucket.closeIcon} style={globalStyles.iconImage} />
                </TouchableOpacity>
            ),
        });

        const saveProgress = async () => {
            if (!userID) return; // Ensure userID is available
        
            const postData = {
                userID,
                quizId: id,
                score,
                correctAnswers,
                totalQuestions,
                questions,
            };
        
            showLoader();
            try {
                const response = await httpService.post('saveQuizProgress', postData);
                showToast('warning', toast, response.message);
                loggerService('default', 'Save Quiz Response : ', response);
        
                // Save to local database
                await saveQuizResultToLocalDatabase({
                    userID,
                    quizId: id,
                    score,
                    correctAnswers,
                    totalQuestions,
                    questions: JSON.stringify(questions), // Store questions as a JSON string
                });
            } catch (error) {
                loggerService('error', 'Save Quiz Error Response : ', error);
                showToast('danger', toast, 'Failed to save quiz progress. Please try again.');
            } finally {
                hideLoader();
            }
        };

        saveProgress();
    }, [score, correctAnswers, totalQuestions, questions, id, userID, navigation]);

    const saveQuizResultToLocalDatabase = async (data:any) => {
        try {
            const existingResults = await AsyncStorage.getItem('QuizResults');
            const results = existingResults ? JSON.parse(existingResults) : [];
            results.push(data);
            await AsyncStorage.setItem('QuizResults', JSON.stringify(results));
        } catch (error) {
            console.error('Error saving quiz results to local database:', error);
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
                    onPress: () => navigation.goBack(),
                },
            ]
        );
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                showExitConfirmation();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const renderBadge = () => {
        switch (calculateGrade) {
            case 'A+':
                return imagesBucket.badge_gold; // Gold badge image
            case 'A':
                return imagesBucket.badge_silver; // Silver badge image
            case 'B':
                return imagesBucket.badge_bronze; // Bronze badge image
            default:
                return imagesBucket.badge_participation; // Participation image
        }
    };

    return (
        <View style={globalStyles.mainContainer}>
            <View style={[globalStyles.padding, globalStyles.mTop20]}>
                <Text style={styles.heading}>Quiz Completed!</Text>

                <View style={styles.scoreCard}>
                    <Text style={styles.scoreText}>Score: {score} Points</Text>
                    <Text style={styles.resultText}>{correctAnswers}/{totalQuestions} Correct</Text>

                    <View style={styles.badgeContainer}>
                        <Image source={renderBadge()} style={styles.badgeImage} />
                        <Text style={styles.gradeText}>Grade: {calculateGrade}</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressTitle}>Your Progress</Text>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: `${progressPercentage}%` },
                            ]}
                        />
                    </View>
                </View>
                <View style={[globalStyles.mTop20, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ReviewAnswersScreen', {
                                questions, // Pass the updated questions array
                                score,
                                correctAnswers,
                                totalQuestions,
                                title,
                                id
                            })
                        }
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Review Answers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'HomeScreen' })} style={[styles.button, styles.secondaryButton]}>
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: GlobalColors.colors.white,
        marginTop: 20,
        textAlign: 'center',
    },
    scoreCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GlobalColors.colors.primaryColor,
    },
    resultText: {
        fontSize: 18,
        color: '#777',
        marginVertical: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    badgeImage: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    gradeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    progressTitle: {
        fontSize: 18,
        color: '#fff',
    },
    progressBarBackground: {
        width: '80%',
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginTop: 10,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: GlobalColors.colors.primaryColor,
        borderRadius: 5,
    },
    button: {
        backgroundColor: GlobalColors.colors.primaryColor,
        marginVertical: 10,
        width: '50%',
        padding: 15,
        margin: 3,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginHorizontal: -2,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderColor: '#4CAF50',
        borderWidth: 2,
    },
    secondaryButtonText: {
        color: '#4CAF50',
    },
});

export default QuizResultsScreen;
