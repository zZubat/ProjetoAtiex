import React, { useState, useEffect, useRef } from 'react';
import DialogueBox from './components/DialogueBox';
import './styles/App.css';

// Importe suas imagens
import startScreenBg from './assets/start-screen.jpg';
import gameBg from './assets/game-background.jpg';
import professorSprite from './assets/professor.png';

// --- BANCO DE DADOS DAS PERGUNTAS ---
const allQuestions = [
  { question: 'Você gosta de entender como funcionam máquinas e equipamentos?', course: 'Mecatrônica' },
  { question: 'Se interessa por automação e robótica?', course: 'Mecatrônica' },
  { question: 'Gosta de colocar a mão na massa para montar ou consertar algo?', course: 'Mecatrônica' },
  { question: 'Ficaria satisfeito em projetar sistemas que unem mecânica, eletrônica e informática?', course: 'Mecatrônica' },
  { question: 'Se sente atraído por indústrias e ambientes tecnológicos?', course: 'Mecatrônica' },
  { question: 'Você gosta de resolver problemas lógicos e desafios de raciocínio?', course: 'ADS' },
  { question: 'Tem interesse em aprender linguagens de programação?', course: 'ADS' },
  { question: 'Gosta da ideia de criar aplicativos ou sistemas para ajudar pessoas ou empresas?', course: 'ADS' },
  { question: 'Se interessa por tecnologia da informação e inovação digital?', course: 'ADS' },
  { question: 'Prefere trabalhar em projetos que envolvam análise de dados e software?', course: 'ADS' },
];

// --- SCRIPT DE INTRODUÇÃO ---
const introScript = [
  { text: "Olá, eu sou o professor Carvalho." },
  { text: "Hoje vou ajudar você a escolher um curso aqui no SENAI..." },
  { text: "Vou fazer algumas perguntas rápidas, ok? Você topa?", choices: ['Sim', 'Não'] },
];

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

function App() {
  const [gameState, setGameState] = useState('start');
  const [scriptIndex, setScriptIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ Mecatrônica: 0, ADS: 0 });
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // --- CONTROLE DE ÁUDIO ---
  const backgroundMusicRef = useRef(new Audio('/8-bit-game-music-122259.mp3'));

  useEffect(() => {
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.3;
  }, []);

  const handleChoice = (choice) => {
    if (gameState === 'intro') {
      if (choice === 'Sim') {
        setQuestions(shuffleArray([...allQuestions]));
        setGameState('quiz');
      } else {
        handleRestart();
      }
      return;
    }
    if (gameState === 'quiz') {
      if (choice === 'Sim') {
        const currentCourse = questions[currentQuestionIndex].course;
        setScores(prevScores => ({
          ...prevScores,
          [currentCourse]: prevScores[currentCourse] + 1,
        }));
      }
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }
  };

  const handleDialogueAdvance = () => {
    if (gameState === 'intro' && !introScript[scriptIndex].choices) {
      if (scriptIndex < introScript.length - 1) {
        setScriptIndex(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleDialogueAdvance);
    return () => window.removeEventListener('click', handleDialogueAdvance);
  }, [gameState, scriptIndex]);

  const handleRestart = () => {
    setGameState('start');
    setScriptIndex(0);
    setCurrentQuestionIndex(0);
    setScores({ Mecatrônica: 0, ADS: 0 });
    backgroundMusicRef.current.pause();
    backgroundMusicRef.current.currentTime = 0;
  };

  const handleFirstInteraction = () => {
  if (!userHasInteracted) {
    backgroundMusicRef.current.play().catch(e => console.error("Erro ao tocar música:", e));
    setUserHasInteracted(true);
  }
};

  // --- RENDERIZAÇÃO ---

  if (gameState === 'start') {
  return (
    <div 
      className="app-container" 
      style={{ backgroundImage: `url(${startScreenBg})` }}
      onClick={handleFirstInteraction} // Adicione isso para capturar qualquer clique na tela
    >
       <h1>DESCUBRA SEU CURSO</h1>
       <button 
         className="start-button" 
         onClick={() => {
           handleFirstInteraction(); // Garante que a música toque
           setGameState('intro'); // Inicia o jogo
         }}
       >
         Press Start
       </button>
    </div>
  );
}

  if (gameState === 'result') {
    let winner = 'Indefinido';
    let winnerMessage = `Parabéns! Com base nas suas respostas, este curso parece ser uma ótima escolha para você!`;

    if (scores.ADS > scores.Mecatrônica) {
      winner = 'Análise e Desenvolvimento de Sistemas';
    } else if (scores.Mecatrônica > scores.ADS) {
      winner = 'Tecnólogo em Mecatrônica Industrial';
    } else {
      winner = 'Ambos os cursos!';
      winnerMessage = 'Você se saiu bem em ambas as áreas! Recomendamos pesquisar um pouco mais sobre os dois cursos.'
    }
    
    return (
       <div className="app-container result-screen" style={{ backgroundImage: `url(${gameBg})` }}>
        <div className="result-content">
            <h2>Resultado Final</h2>
            <p>Seu curso recomendado é:</p>
            <h1 className="winner-course">{winner}</h1>
        </div>
        <DialogueBox text={winnerMessage} />
        <button className="restart-button" onClick={handleRestart}>Fazer o teste novamente</button>
      </div>
    );
  }

  const currentDialogue = gameState === 'intro' 
    ? introScript[scriptIndex] 
    : { text: questions[currentQuestionIndex]?.question, choices: ['Sim', 'Não'] };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${gameBg})` }}>
      <img src={professorSprite} alt="Professor" className="sprite" />
      <DialogueBox
        text={currentDialogue.text}
        choices={currentDialogue.choices}
        onChoice={handleChoice}
      />
    </div>
  );
}

export default App;