import React from 'react';
import { useGlobalContext } from './context';

const Modal = () => {
  const { isModalOpen, closeModal, correct, questions } = useGlobalContext();

  return (
    <div className={`modal-container ${isModalOpen ? 'isOpen' : ''}`}>
      <div className="modal-content">
        {((correct / questions.length) * 100).toFixed(0) < 60 && (
          <>
            <h2>try again!</h2>
            <p>
              You answered only{' '}
              {((correct / questions.length) * 100).toFixed(0)}% of questions
              correctly!
            </p>
          </>
        )}
        {((correct / questions.length) * 100).toFixed(0) >= 60 && (
          <>
            <h2>congrats!</h2>
            <p>
              You answered {((correct / questions.length) * 100).toFixed(0)}% of
              questions correctly!
            </p>
          </>
        )}

        <button className="close-btn" onClick={closeModal}>
          Play again!
        </button>
      </div>
    </div>
  );
};

export default Modal;
