import React from 'react';
import { useGlobalContext } from './context';

import SetupForm from './SetupForm';
import Loading from './Loading';
import Modal from './Modal';

function App() {
  const {
    isWaiting,
    isLoading,
    questions,
    answers,
    index,
    correct,
    nextQuestion,
    checkAnswer,
    isAnswered,
    userAnswer,
  } = useGlobalContext();

  if (isWaiting) return <SetupForm />;
  if (isLoading) return <Loading />;

  const { question, correct_answer } = questions[index];

  return (
    <main>
      <Modal />
      <section className="quiz">
        <p className="correct-answers">
          correct answers: {correct}/{index + 1}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((answer, index) => {
              return (
                <button
                  key={index}
                  className={`answer-btn 
                  ${isAnswered && 'answered'}
                  ${
                    isAnswered &&
                    (answer === correct_answer ? 'correct-answer' : '')
                  } ${
                    isAnswered &&
                    answer === userAnswer &&
                    answer !== correct_answer
                      ? 'wrong-answer'
                      : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: answer }}
                  disabled={isAnswered}
                  onClick={() => {
                    return checkAnswer(answer, correct_answer === answer);
                  }}
                />
              );
            })}
          </div>
        </article>
        <button className="next-question" onClick={nextQuestion}>
          next question
        </button>
      </section>
    </main>
  );
}

export default App;
