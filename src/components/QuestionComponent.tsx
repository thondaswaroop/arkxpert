import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { globalStyles } from '../Resources';

interface QuestionComponentProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  feedback: { [key: number]: 'correct' | 'wrong' };
  questionInfo: any;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  feedback,
  questionInfo,
  currentQuestionIndex,
  totalQuestions
}) => {
  console.log('questionInfo', questionInfo);
  return (
    <View style={styles.container}>
      {/* Question Text */}
      <View>
        <Text style={[globalStyles.mediumFont, globalStyles.p, globalStyles.themeTextColor,  globalStyles.mBottom10]}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Text>
      </View>

      <View style={[globalStyles.textCenter, globalStyles.mBottom20]}>
        <Text style={[styles.questionText, globalStyles.textCenter, globalStyles.themeTextColor]}>{question}</Text>
      </View>

      {/* Options */}
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          let backgroundColor = '#fff';
          let borderColor = '#e0e0e0';

          // Immediate color change when an option is selected
          if (selectedAnswer === index) {
            backgroundColor = '#ccc'; // Grey for selected option
          }

          // Feedback after pressing "Next"
          if (selectedAnswer !== null) {
            if (feedback[selectedAnswer] === 'wrong' && selectedAnswer === index) {
              backgroundColor = '#ff6f6f'; // Red for wrong answer
            } else if (feedback[selectedAnswer] === 'correct' && selectedAnswer === index) {
              backgroundColor = '#4caf50'; // Green for selected correct answer
            } else if (feedback[index] === 'correct') {
              backgroundColor = '#4caf50'; // Green for the correct answer
            }
          }

          return (
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor, borderColor }]}
              onPress={() => onSelectAnswer(index)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 25,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
});

export default QuestionComponent;
