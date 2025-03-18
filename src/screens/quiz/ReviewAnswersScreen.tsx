import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../Resources';
import { GlobalColors } from '../../styles/Colors';

const ReviewAnswersScreen = ({ route }: any) => {
    const { questions = [], score = 0, totalQuestions = 0, correctAnswers = 0, title, id } = route.params || {};
    const navigation = useNavigation();

    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
    };

    const retakeQuiz = () => {
        const data: any = { 'title': title, id: id };
        navigation.navigate('ViewTopic', data);
    };

    useEffect(() => {
        navigation.setOptions({ title:'Review Answers',headerStyle: {
            backgroundColor: GlobalColors.colors.themeBlack, // Set toolbar background color
        },
        headerTintColor: GlobalColors.colors.white }); // Set screen title
    }, []);

    return (
        <View style={globalStyles.mainContainer}>
            {/* Score Summary */}
            <View style={[globalStyles.flex,styles.scoreContainer]}>
                <Text style={styles.scoreText}>Final Score: {score} 🪙</Text>
                <Text style={styles.scoreText}>Correct Answers: {correctAnswers}/{totalQuestions}</Text>
            </View>

            {/* List of Questions */}
            <ScrollView style={styles.questionList}>
                {questions.map((question: any, index: any) => {
                    const isCorrect = question.correctAnswer === question.userSelectedAnswer;
                    const isExpanded = expandedQuestionIndex === index;

                    return (
                        <View key={index} style={styles.questionContainer}>
                            <TouchableOpacity onPress={() => toggleQuestion(index)} style={styles.questionHeader}>
                            <Text style={{color:'#fff',width:'8%'}}>{index + 1}</Text>
                            <Text style={{width:'92%',color:'#fff'}}>{question.title}</Text>
                            </TouchableOpacity>

                            {/* Options & Explanation - Displayed only if the question is expanded */}
                            {isExpanded && (
                                <View style={styles.expandedContent}>
                                    {/* Options */}
                                    {question.options.map((option: any, optionIndex: any) => {
                                        const isSelected = question.userSelectedAnswer === optionIndex;
                                        const isCorrectAnswer = question.correctAnswer === optionIndex;

                                        return (
                                            <View key={optionIndex} style={[
                                                styles.optionContainer,
                                                isCorrectAnswer ? styles.correctAnswer : {},
                                                isSelected && !isCorrect ? styles.incorrectAnswer : {},
                                            ]}>
                                                <Text style={[
                                                    styles.optionText,
                                                    isSelected ? styles.selectedOptionText : {}
                                                ]}>
                                                    {optionIndex + 1}. {option}
                                                </Text>
                                            </View>
                                        );
                                    })}

                                    {/* Explanation */}
                                    <View style={styles.explanationContainer}>
                                        <Text style={styles.explanationHeader}>Explanation:</Text>
                                        <Text style={styles.explanationText}>{question.explanation}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[globalStyles.borderButton, globalStyles.halfwidth]} onPress={retakeQuiz}>
                    <Text style={styles.buttonText}>Retake Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.borderButton, globalStyles.halfwidth, globalStyles.mLeft20]} onPress={() => navigation.navigate('Home', { screen: 'HomeScreen' })}>
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReviewAnswersScreen;

const styles = StyleSheet.create({
    scoreContainer: {
        padding: 20,
        backgroundColor: GlobalColors.colors.secondaryBlack,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    scoreText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: GlobalColors.colors.white,
    },
    questionList: {
        paddingHorizontal: 10,
    },
    questionContainer: {
        backgroundColor: '#1c1c1c', // Dark background for the accordion container
        borderRadius: 3,
        borderWidth:0.2,
        borderColor:GlobalColors.colors.white,
        marginVertical: 8,
        padding: 15,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    questionText: {
        fontSize: 18,
        fontWeight: '500',
        color: GlobalColors.colors.white,
    },
    expandedContent: {
        marginTop: 20,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 2,
        marginVertical: 2,
    },
    optionText: {
        color: GlobalColors.colors.white,
    },
    correctAnswer: {
        backgroundColor: '#0e4f11', // Light green background for correct answers
    },
    incorrectAnswer: {
        backgroundColor: '#9c281f', // Light red background for incorrect answers
    },
    selectedOptionText: {
        fontWeight: 'bold',
        color: GlobalColors.colors.white,
    },
    explanationContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#333333', // Slightly lighter black for explanation
        borderRadius: 8,
    },
    explanationHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GlobalColors.colors.white,
        marginBottom: 5,
    },
    explanationText: {
        fontSize: 14,
        color: GlobalColors.colors.lightGrey,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    buttonText: {
        fontSize: 15,
        color: GlobalColors.colors.white,
    },
});
