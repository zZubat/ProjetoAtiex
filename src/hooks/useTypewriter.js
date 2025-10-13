// zzubat/projetoatiex/ProjetoAtiex-3fea5aa86f6b9cbc38e3a20bc11380d730695f27/src/hooks/useTypewriter.js

import { useState, useEffect } from 'react';

// Usa um encadeamento de setTimeout, que é mais robusto que setInterval para este efeito.
export const useTypewriter = (text, speed = 50, initialDelay = 0) => {
  // charIndex é a única variável de estado, controlando quantos caracteres são exibidos
  const [charIndex, setCharIndex] = useState(0); 

  // Efeito 1: Reseta o índice sempre que o texto/velocidade/atraso mudar
  useEffect(() => {
    setCharIndex(0); 
  }, [text, speed, initialDelay]);


  // Efeito 2: Cria a cadeia de setTimeout para a animação
  useEffect(() => {
    // 1. Verifica se o texto é válido ou se a animação já terminou
    if (!text || charIndex >= text.length) {
      return; 
    }

    // 2. Determina o atraso: usa initialDelay apenas para o primeiro caractere (index 0), 
    //    e a speed para os caracteres seguintes.
    const delay = charIndex === 0 ? initialDelay : speed;
    
    // 3. Configura o temporizador
    const timeout = setTimeout(() => {
      // Avança o índice usando a forma funcional para garantir o valor mais recente
      // O avanço do índice dispara este useEffect novamente, criando o ciclo da animação
      setCharIndex(prevIndex => prevIndex + 1);
    }, delay);

    // Função de limpeza: Garante que o timeout pendente seja cancelado a cada re-render
    return () => clearTimeout(timeout);
    
  // A dependência em charIndex cria a "corrente" da animação
  }, [text, charIndex, speed, initialDelay]);

  // O texto exibido é uma substring do texto completo, determinada por charIndex
  const displayText = text ? text.substring(0, charIndex) : '';

  return displayText;
};