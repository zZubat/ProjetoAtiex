// zzubat/projetoatiex/ProjetoAtiex-52deada71db2eb486fff0a4c9e7ff14e37d0a383/src/components/QuizScreens.jsx
import React, { useState, useEffect } from 'react'; // Importa useEffect
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
  // Novo estado para controlar se a digitação foi pulada
  const [typingSkipped, setTypingSkipped] = useState(false);
  
  const currentQuestion = shuffledQuizData[currentQuestionIndex];
  const TYPING_SPEED = 50; // Velocidade da digitação

  // Efeito para resetar o estado de skip (pulo) quando a pergunta muda
  useEffect(() => {
      setTypingSkipped(false);
  }, [currentQuestionIndex]);
  
  const handleAnswer = (answer) => {
      // Nota: A verificação de animação não é mais estritamente necessária aqui, 
      // pois os botões só aparecem se showQuizChoices for true, o que requer o texto completo.
      
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
  
  // O texto exibido é o completo se foi pulado, ou o animado (se não houver pergunta, é vazio)
  const textToDisplay = typingSkipped ? currentQuestion?.question : animatedQuestionText;

  // Condição para mostrar as opções: apenas se o texto a ser exibido for o texto completo
  const showQuizChoices = textToDisplay === currentQuestion?.question;

  // Handler para pular a animação no clique
  const handleSkipTyping = () => {
      // Se o quiz não tiver terminado E o texto não for o texto completo (ou seja, a animação está rodando)
      if (!quizFinished && textToDisplay !== currentQuestion?.question) {
          setTypingSkipped(true);
      }
  };


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
        // Na tela de resultado
        <DialogueBox choices={resultChoices} onChoice={onRestart}>
          <p>Parabéns! O resultado é:</p>
          <h2>{getResultText()}</h2>
        </DialogueBox>
      ) : (
        // Tela do Quiz. Adiciona o handler de clique para pular a animação.
        <DialogueBox 
            choices={showQuizChoices ? quizChoices : []} 
            onChoice={handleAnswer}
            onClick={handleSkipTyping} // Adicionado o handler de clique
        >
          <p>{textToDisplay}</p>
        </DialogueBox>
      )}
    </div>
  );
}

export default QuizScreen;