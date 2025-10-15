// zzubat/projetoatiex/ProjetoAtiex-52deada71db2eb486fff0a4c9e7ff14e37d0a383/src/components/IntroScreen.jsx
import React, { useState, useEffect } from 'react';
import DialogueBox from './DialogueBox';
import backgrounds from '../assets/backgrounds/quiz-bg.png';
import { useTypewriter } from '../hooks/useTypewriter';

// Script de introdução em etapas (Estágios 0, 1, 2, 3)
const INTRO_SCRIPT = [
  "Olá, eu sou o Professor Carvalho!", // 0
  "Seja bem-vindo ao Quiz Pokémon da sua Carreira!", // 1
  "Vou te ajudar a descobrir qual curso do SENAI mais combina com você.", // 2
  "São apenas algumas perguntas, nada muito demorado." // 3
];

// Constantes para identificar os novos estágios
const CONFIRM_STEP = 4;
const ACCEPT_STEP = 5;
const DECLINE_STEP = 6;

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

  // LÓGICA DO TYPEWRITER E SKIP (Definida no início para ser usada no handleChoice e handleSkipTyping)
  const TYPING_SPEED = 50;

  let currentText = '';
  let choices = [];

  // 1. DEFINE O TEXTO E AS OPÇÕES COM BASE NO ESTADO ATUAL
  if (step < CONFIRM_STEP) {
    currentText = INTRO_SCRIPT[step];
    choices = [{ text: 'Continuar', value: 'continue' }];
  } else if (step === CONFIRM_STEP) {
    currentText = "Você topa?";
    choices = [
      { text: 'Sim', value: 'yes' },
      { text: 'Não', value: 'no' }
    ];
  } else if (step === ACCEPT_STEP) {
    currentText = "Então vamos lá!";
    choices = [{ text: 'Começar Quiz!', value: 'advance' }];
  } else if (step === DECLINE_STEP) {
    currentText = "Que pena, quem sabe da próxima. Até mais!";
    choices = [{ text: 'Voltar ao Início', value: 'restart' }];
  }

  // 2. OBTÉM TEXTO ANIMADO/COMPLETO
  const animatedText = useTypewriter(currentText, TYPING_SPEED);
  const textToDisplay = typingSkipped ? currentText : animatedText;
  const showChoices = textToDisplay === currentText;


  // 3. HANDLER UNIFICADO PARA TODAS AS AÇÕES DO BOTÃO (CORRIGINDO O BUG)
  const handleChoice = (choice) => {
    // Só permite o avanço/escolha se o texto estiver completo
    if (textToDisplay !== currentText) {
      return;
    }

    if (step < CONFIRM_STEP) {
      // Passos sequenciais: 'Continuar'
      setStep(prev => prev + 1);

    } else if (step === CONFIRM_STEP) {
      // Passo de confirmação: 'Você topa?' - Onde o bug estava
      if (choice === 'yes') {
        setStep(ACCEPT_STEP); // CORRIGIDO: Avança para o passo 5
      } else {
        setStep(DECLINE_STEP); // Avança para o passo 6
      }

    } else if (step === ACCEPT_STEP) {
      // Passo de aceite: 'Começar Quiz!'
      onAdvance(); // Inicia o quiz

    } else if (step === DECLINE_STEP) {
      // Passo de recusa: 'Voltar ao Início'
      onRestart(); // Volta para a tela inicial
    }
  };


  // 4. HANDLER DE PULO DE ANIMAÇÃO
  const handleSkipTyping = () => {
    if (textToDisplay !== currentText) {
      setTypingSkipped(true);
    } else if (step < CONFIRM_STEP) {
      // Se o texto já estiver completo, um clique na caixa age como 'Continuar'
      handleChoice('continue');
    }
  };


  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgrounds})` }}
    >
      <DialogueBox
        choices={showChoices ? choices : []}
        onChoice={handleChoice} // Usa o novo handler unificado
        onClick={handleSkipTyping}
      >
        <p>{textToDisplay}</p>
      </DialogueBox>
    </div>
  );
}

export default IntroScreen;