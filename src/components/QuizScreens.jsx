import React, { useState, useEffect, useRef } from 'react'; // Adicionado useRef e useEffect
import DialogueBox from './DialogueBox';
import backgrounds from '../assets/backgrounds/quiz-bg.png';
import resultBackground from '../assets/backgrounds/intro-bg2.png';
import quizData from '../data/quizData';
import { useTypewriter } from '../hooks/useTypewriter';

// Função auxiliar para embaralhar um array (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function QuizScreen({ onRestart }) {
  const [shuffledQuizData] = useState(() => shuffleArray(quizData));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [adsScore, setAdsScore] = useState(0);
  const [mecatronicaScore, setMecatronicaScore] = useState(0);
  const [outrosScore, setOutrosScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [typingSkipped, setTypingSkipped] = useState(false);

  // --- NOVO: Som de Vitória ---
  // (Lembre-se de adicionar um arquivo 'victory.mp3' na sua pasta /public)
  const victorySoundRef = useRef(new Audio('8-BIT-Victory-sound-effect.mp3'));

  useEffect(() => {
    // Toca o som de vitória quando o quiz termina
    if (quizFinished) {
      victorySoundRef.current.volume = 0.5;
      victorySoundRef.current.play().catch(e => console.error("Erro ao tocar som de vitória:", e));
    }
  }, [quizFinished]); // Dispara quando quizFinished se torna true
  // --- FIM DO NOVO CÓDIGO ---


  useEffect(() => {
    setTypingSkipped(false);
  }, [currentQuestionIndex]);

  const currentQuestion = shuffledQuizData[currentQuestionIndex];
  const TYPING_SPEED = 50; 

  const handleAnswer = (answer) => {
    if (answer === 'yes') {
      setAdsScore(prev => prev + (currentQuestion.scores.ads || 0));
      setMecatronicaScore(prev => prev + (currentQuestion.scores.mecatronica || 0));
      setOutrosScore(prev => prev + (currentQuestion.scores.outros || 0));
    }
    if (currentQuestionIndex < shuffledQuizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true); // <<-- O som de vitória tocará aqui!
    }
  };
 
  const animatedQuestionText = useTypewriter(currentQuestion?.question, TYPING_SPEED);
  const textToDisplay = typingSkipped ? currentQuestion?.question : animatedQuestionText;
  const showQuizChoices = textToDisplay === currentQuestion?.question;

  const handleSkipTyping = () => {
    if (!quizFinished && textToDisplay !== currentQuestion?.question) {
      setTypingSkipped(true);
    }
  };

  const getResultText = () => {
    if (adsScore === 0 && mecatronicaScore === 0 && outrosScore === 0) {
      return "Parece que você ainda está explorando suas opções. Nenhum curso se encaixou totalmente, mas continue tentando!";
    }
    const scores = {
      'Análise e Desenvolvimento de Sistemas': adsScore,
      'Tecnologia em Mecatrônica Industrial': mecatronicaScore,
      'Outros Cursos Técnicos/Gerais': outrosScore
    };
    const maxScore = Math.max(adsScore, mecatronicaScore, outrosScore);
    const winners = Object.keys(scores).filter(course => scores[course] === maxScore);
    if (winners.length === 1) {
      return `Seu curso ideal é ${winners[0]}!`;
    } else if (winners.length === 2) {
      if (winners.includes('Outros Cursos Técnicos/Gerais')) {
        const specificCourse = winners.find(c => c !== 'Outros Cursos Técnicos/Gerais');
        return `Você se encaixa em ${specificCourse} e em outras áreas!`;
      }
      return `Você se encaixa bem nos cursos de ${winners[0]} e ${winners[1]}!`;
} else {
 return 'Você se encaixa em todos os perfis de curso, explore suas opções!';
}
};

 const quizChoices = [
{ text: 'Sim', value: 'yes' },
 { text: 'Não', value: 'no' },
 ];

const resultChoices = [
{ text: 'Refazer Quiz', value: 'restart' }
 ];

 const containerClass = quizFinished ? "app-container result-screen" : "app-container";
const backgroundStyle = {
 backgroundImage: `url(${quizFinished ? resultBackground : backgrounds})`
};

 return (
 <div
 className={containerClass} 
 style={backgroundStyle} 
 >
 {quizFinished ? (
        // Nenhuma mudança de JSX é necessária aqui! 
        // O CSS aplicará o brilho ao <h2> automaticamente
<DialogueBox
 choices={resultChoices}
 onChoice={onRestart}
 className="result-box"
 >
 <p>Parabéns! O resultado é:</p>
 <h2>{getResultText()}</h2>
 </DialogueBox>
 ) : (
 <DialogueBox
 choices={showQuizChoices ? quizChoices : []}
 onChoice={handleAnswer}
 onClick={handleSkipTyping}
 >
 <p>{textToDisplay}</p>
 </DialogueBox>
 )}
 </div>
 );
}

export default QuizScreen;
