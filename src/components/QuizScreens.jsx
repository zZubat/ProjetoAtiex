// src/components/QuizScreens.jsx
import React, { useState } from 'react';
import DialogueBox from './DialogueBox'; 
import backgrounds from '../assets/backgrounds/quiz-bg.png';
import quizData from '../data/quizData';
import { useTypewriter } from '../hooks/useTypewriter'; // Importa o hook

// Função auxiliar para embaralhar um array (Fisher-Yates)
const shuffleArray = (array) => {
    // Cria uma cópia do array para não modificar o original
    const shuffled = [...array]; 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Troca de elementos (Swap)
    }
    return shuffled;
};

// Aceita a prop onRestart
function QuizScreen({ onRestart }) { 
  // Estado para armazenar as perguntas embaralhadas. Inicializa com o array embaralhado.
  const [shuffledQuizData] = useState(() => shuffleArray(quizData));
    
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [adsScore, setAdsScore] = useState(0);
  const [mecatronicaScore, setMecatronicaScore] = useState(0);
  const [outrosScore, setOutrosScore] = useState(0); 
  const [quizFinished, setQuizFinished] = useState(false);
  
  const currentQuestion = shuffledQuizData[currentQuestionIndex];
  const TYPING_SPEED = 50; // Velocidade da digitação

  const handleAnswer = (answer) => {
    // Verifica se a animação terminou antes de aceitar a resposta
    if (animatedQuestionText !== currentQuestion.question) {
        return; 
    }
      
    if (answer === 'yes') {
      // Adiciona pontuação para os três cursos, garantindo um valor default de 0
      setAdsScore(prev => prev + (currentQuestion.scores.ads || 0));
      setMecatronicaScore(prev => prev + (currentQuestion.scores.mecatronica || 0));
      setOutrosScore(prev => prev + (currentQuestion.scores.outros || 0));
    }
    
    // Usa o array embaralhado para verificar o fim do quiz
    if (currentQuestionIndex < shuffledQuizData.length - 1) { 
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Aplica a animação de digitação à pergunta atual. 
  // A chave é usar currentQuestion.question para garantir que o hook reinicie quando a pergunta mudar.
  const animatedQuestionText = useTypewriter(currentQuestion?.question, TYPING_SPEED); 
  
  // Condição para mostrar as opções: apenas se a animação terminar
  const showQuizChoices = animatedQuestionText === currentQuestion?.question;


  // Função para calcular o texto do resultado
  const getResultText = () => {
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

  // Configuração para o botão de refazer quiz
  const resultChoices = [
      { text: 'Refazer Quiz', value: 'restart' }
  ];

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgrounds})` }}
    >
      {quizFinished ? (
        // Na tela de resultado, a animação de digitação não é necessária no resultado final.
        <DialogueBox choices={resultChoices} onChoice={onRestart}>
          <p>Parabéns! O resultado é:</p>
          <h2>{getResultText()}</h2>
        </DialogueBox>
      ) : (
        // Renderiza a pergunta animada. Só mostra as escolhas depois de terminar.
        <DialogueBox choices={showQuizChoices ? quizChoices : []} onChoice={handleAnswer}>
          <p>{animatedQuestionText}</p>
        </DialogueBox>
      )}
    </div>
  );
}

export default QuizScreen;