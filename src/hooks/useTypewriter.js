// src/hooks/useTypewriter.js
import { useState, useEffect } from 'react';

// Adiciona initialDelay (em ms) para controlar quando a digitação começa
export const useTypewriter = (text, speed = 50, initialDelay = 0) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // Variáveis para armazenar os IDs dos timers para limpeza
    let startTypingTimeout;
    let typingInterval;
    
    // Reseta o texto no início de cada efeito
    setDisplayText(''); 

    if (text) {
      // 1. Configura um temporizador para iniciar a digitação após o atraso inicial
      startTypingTimeout = setTimeout(() => {
        let i = 0;
        typingInterval = setInterval(() => {
          if (i < text.length) {
            setDisplayText(prev => prev + text.charAt(i));
            i++;
          } else {
            // Se o texto estiver completo, definimos o texto final de uma vez e paramos
            setDisplayText(text); 
            clearInterval(typingInterval);
          }
        }, speed);
      }, initialDelay); 
    }
    
    // Função de limpeza: Garante que tanto o setTimeout quanto o setInterval sejam cancelados
    return () => {
      clearTimeout(startTypingTimeout);
      clearInterval(typingInterval); 
    };

  }, [text, speed, initialDelay]);

  return displayText;
};