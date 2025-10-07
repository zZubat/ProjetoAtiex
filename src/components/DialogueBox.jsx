import React from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import './DialogueBox.css';

const DialogueBox = ({ text, choices = [], onChoice }) => {
  // Agora recebemos um array: [texto, terminouDeDigitar]
  const [typedText, isTypingFinished] = useTypewriter(text);

  // A nova condição é muito mais confiável!
  const showChoices = isTypingFinished && choices.length > 0;

  return (
    <div className="dialogue-box-container">
      <p className="dialogue-text">{typedText}</p>

      {showChoices && (
        <div className="choices-container">
          {choices.map((choice) => (
            <button
              key={choice}
              className="choice-button"
              onClick={() => onChoice(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DialogueBox;