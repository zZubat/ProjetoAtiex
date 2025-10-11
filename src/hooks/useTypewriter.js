import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  

  const charIndex = useRef(0);

  useEffect(() => {

    charIndex.current = 0;
    setDisplayText('');
    setIsFinished(false); 

    if (text) {
      const typingInterval = setInterval(() => {

        if (charIndex.current < text.length) {
            

          setDisplayText(text.substring(0, charIndex.current + 1));
          
          // 5. Incrementa a ref
          charIndex.current += 1;
        } else {
          clearInterval(typingInterval);
          setIsFinished(true);
        }
      }, speed);

      return () => {
        clearInterval(typingInterval);
      };
    } else {
      setIsFinished(true);
    }
  }, [text, speed]);

  return [displayText, isFinished];
};