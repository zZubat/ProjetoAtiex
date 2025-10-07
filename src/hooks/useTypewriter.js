import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false); // NOVO ESTADO

  useEffect(() => {
    setDisplayText('');
    setIsFinished(false); // Reseta o estado ao mudar o texto

    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsFinished(true); // SINALIZA QUE TERMINOU!
        }
      }, speed);

      return () => {
        clearInterval(typingInterval);
      };
    } else {
        setIsFinished(true); // Se não há texto, considera como terminado
    }
  }, [text, speed]);

  return [displayText, isFinished]; // RETORNA O TEXTO E O ESTADO
};