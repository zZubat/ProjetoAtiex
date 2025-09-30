import React, { useState, useEffect } from 'react';
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

// Função para embaralhar as perguntas
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

function App() {
  // Estados do jogo: 'start', 'intro', 'quiz', 'result'
  const [gameState, setGameState] = useState('start');
  const [scriptIndex, setScriptIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ Mecatrônica: 0, ADS: 0 });

  // Inicia o quiz embaralhando as perguntas
  const startQuiz = () => {
    setQuestions(shuffleArray([...allQuestions]));
    setGameState('quiz');
  };
  
  // Lida com as escolhas durante o diálogo e o quiz
  const handleChoice = (choice) => {
    // Se estamos na introdução
    if (gameState === 'intro') {
      if (choice === 'Sim') {
        startQuiz(); // Começa o quiz
      } else {
        // Se disser não, volta para a tela inicial
        handleRestart(); 
      }
      return;
    }
    
    // Se estamos no quiz
    if (gameState === 'quiz') {
      // Se a resposta for "Sim", adiciona ponto ao curso correspondente
      if (choice === 'Sim') {
        const currentCourse = questions[currentQuestionIndex].course;
        setScores(prevScores => ({
          ...prevScores,
          [currentCourse]: prevScores[currentCourse] + 1,
        }));
      }

      // Vai para a próxima pergunta ou para a tela de resultado
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }
  };

  // Lida com o avanço do diálogo (clique ou Enter)
  const handleDialogueAdvance = () => {
    // Só avança se não houver escolhas na tela
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
  };

  // --- RENDERIZAÇÃO DOS COMPONENTES ---

  // 1. Tela de Início
  if (gameState === 'start') {
    return (
      <div className="app-container" style={{ backgroundImage: `url(${startScreenBg})` }}>
         <h1>DESCUBRA SEU CURSO</h1>
         <button className="start-button" onClick={() => setGameState('intro')}>
           Press Start
         </button>
      </div>
    );
  }

  // 2. Tela de Resultado (Versão Melhorada)
if (gameState === 'result') {
    let winner = 'Indefinido';
    let winnerMessage = `Parabéns! Com base nas suas respostas, este curso parece ser uma ótima escolha para você!`;

    if (scores.ADS > scores.Mecatrônica) {
      winner = 'Análise e Desenvolvimento de Sistemas';
    } else if (scores.Mecatrônica > scores.ADS) {
      winner = 'Tecnólogo em Mecatrônica Industrial';
    } else {
      // Mensagem para o caso de empate
      winner = 'Ambos os cursos!';
      winnerMessage = 'Você se saiu bem em ambas as áreas! Recomendamos pesquisar um pouco mais sobre os dois cursos.'
    }
    
    return (
       <div className="app-container result-screen" style={{ backgroundImage: `url(${gameBg})` }}>
        {/* Removemos o professor para focar no resultado */}
        <div className="result-content">
            <h2>Resultado Final</h2>
            <p>Seu curso recomendado é:</p>
            <h1 className="winner-course">{winner}</h1>
        </div>
        <DialogueBox 
          text={winnerMessage} 
        />
        <button className="restart-button" onClick={handleRestart}>Fazer o teste novamente</button>
      </div>
    );
  }

  // 3. Tela de Jogo (Introdução e Quiz)
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

// Adicione algumas classes CSS genéricas ao seu `App.css` para os novos elementos
/* Em src/styles/App.css */
/*
  .start-button, .restart-button {
    font-family: 'Press Start 2P', cursive;
    font-size: 1.5rem;
    padding: 10px 20px;
    cursor: pointer;
    border: 4px solid #3c3c3c;
    border-radius: 8px;
  }
  .restart-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .sprite {
    height: 300px;
    margin-bottom: 180px;
  }
*/