// zzubat/projetoatiex/ProjetoAtiex-52deada71db2eb486fff0a4c9e7ff14e37d0a383/src/components/IntroScreen.jsx
import React, { useState, useEffect } from 'react'; // Importa useEffect
import DialogueBox from './DialogueBox';
import backgrounds from '../assets/backgrounds/quiz-bg.png'; // Usando o fundo do quiz
import { useTypewriter } from '../hooks/useTypewriter'; // Importa o hook

// Script de introdução em etapas (Estágios 0, 1, 2)
const INTRO_SCRIPT = [
  "Olá, eu sou o Professor Carvalho!",
  "Seja bem-vindo ao Quiz Pokémon da sua Carreira!",
  "Vou te ajudar a descobrir qual curso do SENAI combina mais com você."
];

// Constantes para identificar os novos estágios
const CONFIRM_STEP = 3;
const ACCEPT_STEP = 4;
const DECLINE_STEP = 5;

// Recebe onRestart (para voltar à tela inicial)
function IntroScreen({ onAdvance, onRestart }) { 
  // Estado para controlar o índice do texto atual
  const [step, setStep] = useState(0); 
  // NOVO ESTADO: controla se a digitação foi pulada no passo atual
  const [typingSkipped, setTypingSkipped] = useState(false);

  // NOVO EFEITO: Reseta o estado de skip (pulo) sempre que o passo mudar
  useEffect(() => {
    setTypingSkipped(false);
  }, [step]);

  let currentText;
  let choices = [];
  let onChoiceHandler;
  
  const TYPING_SPEED = 50; // Velocidade da digitação (50ms por caractere)

  if (step < CONFIRM_STEP) {
      // ----------------------------------------------------
      // ESTÁGIOS 0, 1, 2: Diálogo Sequencial
      // ----------------------------------------------------
      currentText = INTRO_SCRIPT[step];
      choices = [{ text: 'Continuar', value: 'continue' }];
      
      const handleContinue = () => {
          // Só avança se o texto já estiver completo ou se foi pulado
          if (textToDisplay === currentText) {
              setStep(prev => prev + 1);
          }
      };
      
      onChoiceHandler = handleContinue;

  } else if (step === CONFIRM_STEP) {
      // ----------------------------------------------------
      // ESTÁGIO 3: "Você topa?" (Confirmação Sim/Não)
      // ----------------------------------------------------
      currentText = "Você topa?";
      choices = [
          { text: 'Sim', value: 'yes' },
          { text: 'Não', value: 'no' }
      ];
      onChoiceHandler = (choice) => {
          if (choice === 'yes') {
              setStep(ACCEPT_STEP); // Avança para "então vamos lá"
          } else {
              setStep(DECLINE_STEP); // Avança para "que pena"
          }
      };

  } else if (step === ACCEPT_STEP) {
      // ----------------------------------------------------
      // ESTÁGIO 4: "então vamos lá" (Aceitou)
      // ----------------------------------------------------
      currentText = "Então vamos lá!";
      choices = [{ text: 'Começar Quiz!', value: 'advance' }];
      onChoiceHandler = onAdvance; // Chama a função que muda para gameState 'quiz'

  } else if (step === DECLINE_STEP) {
      // ----------------------------------------------------
      // ESTÁGIO 5: "que pena" (Recusou)
      // ----------------------------------------------------
      currentText = "Que pena, quem sabe da próxima.";
      choices = [{ text: 'Voltar ao Início', value: 'restart' }];
      onChoiceHandler = onRestart; // Chama a função que muda para gameState 'start'
  }
  
  // Aplica a animação de digitação ao texto atual
  const animatedText = useTypewriter(currentText, TYPING_SPEED);

  // NOVO: O texto exibido é o completo se foi pulado, senão é o animado
  const textToDisplay = typingSkipped ? currentText : animatedText;

  // Apenas permite a interação quando o texto terminar de ser digitado
  const showChoices = textToDisplay === currentText;
  
  // NOVO HANDLER: Pula a animação se não estiver completa
  const handleSkipTyping = () => {
      if (textToDisplay !== currentText) {
          setTypingSkipped(true);
      } else if (step < CONFIRM_STEP) {
          // Se o texto já está completo e estamos nos passos iniciais (0, 1, 2), 
          // um clique na caixa de diálogo também deve ser tratado como "Continuar"
          // O handleContinue do onChoiceHandler já faz essa verificação, 
          // mas é mais intuitivo que o clique na caixa avance.
          onChoiceHandler(); 
      }
  };


  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgrounds})` }}
    >
      {/* Adiciona o handler de clique para pular a animação */}
      <DialogueBox choices={showChoices ? choices : []} onChoice={onChoiceHandler} onClick={handleSkipTyping}> 
        <p>{textToDisplay}</p>
      </DialogueBox>
    </div>
  );
}

export default IntroScreen;