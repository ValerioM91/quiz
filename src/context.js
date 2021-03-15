import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';

const table = {
  sports: 21,
  history: 23,
  politics: 24,
  movies: 11,
  animals: 27,
  videogames: 15,
  television: 14,
};

const API_ENDPOINT = 'https://opentdb.com/api.php?';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);

  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuestions = async url => {
    setIsLoading(true);
    setIsWaiting(false);
    setIndex(0);
    setIsAnswered(false);
    setUserAnswer(null);
    const response = await axios.get(url).catch(err => console.log(err));
    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setIsLoading(false);
        setError(false);
        setIsWaiting(false);
      } else {
        setIsWaiting(true);
        setError(true);
      }
    } else {
      setIsWaiting(true);
    }
  };

  const setCurrentAnswers = () => {
    const { incorrect_answers, correct_answer } = questions[index];
    let answers = [...incorrect_answers];
    const tempIndex = Math.floor(Math.random() * 4);
    if (tempIndex === 3) {
      answers.push(correct_answer);
    } else {
      answers.push(answers[tempIndex]);
      answers[tempIndex] = correct_answer;
    }
    setAnswers(answers);
  };

  const nextQuestion = () => {
    setIsAnswered(false);
    setUserAnswer(null);
    setIndex(oldIndex => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        // OPEN MODAL
        openModal();
        return questions.length - 1;
      } else {
        return index;
      }
    });
  };

  const checkAnswer = (answer, value) => {
    setUserAnswer(answer);
    setIsAnswered(true);
    if (value) {
      setCorrect(oldValue => oldValue + 1);
    }
    // nextQuestion();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCorrect(0);
    setIsWaiting(true);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentAnswers();
    }
  }, [questions, index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider
      value={{
        isWaiting,
        isLoading,
        questions,
        answers,
        setCurrentAnswers,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
        isAnswered,
        userAnswer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
