// src/components/IntroScreen.jsx
import React, { useState } from 'react';
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
      onChoiceHandler = () => setStep(prev => prev + 1);

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

  // Apenas permite a interação quando o texto terminar de ser digitado
  const showChoices = animatedText === currentText;


  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgrounds})` }}
    >
      {/* Passa choices e onChoiceHandler, mas o DialogueBox só mostra os botões se houver choices */}
      <DialogueBox choices={showChoices ? choices : []} onChoice={onChoiceHandler}> 
        <p>{animatedText}</p>
      </DialogueBox>
    </div>
  );
}

export default IntroScreen;