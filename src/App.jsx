import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreens';
import IntroScreen from './components/IntroScreen';
import './styles/App.css';

function App() {
  const [gameState, setGameState] = useState('start');

  const handleStart = () => {
    setGameState('intro'); // O clique na tela inicial leva para 'intro'
  };

  const handleAdvanceToQuiz = () => {
    setGameState('quiz'); // A introdução finalizada leva para 'quiz'
  };

  // Handler para reiniciar o quiz
  const handleRestart = () => {
      setGameState('start');
  };

  return (
    <div className="app-wrapper">
      {gameState === 'start' ? (
        <StartScreen onStart={handleStart} />
      ) : gameState === 'intro' ? ( 
        // Passa onAdvance (para quiz) E onRestart (para start)
        <IntroScreen onAdvance={handleAdvanceToQuiz} onRestart={handleRestart} />
      ) : (
        // Passa o handler de restart para o QuizScreen
        <QuizScreen onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;