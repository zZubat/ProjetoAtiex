// src/components/PressStartTitle.jsx
import React from 'react';
// Importa o hook useTypewriter
import { useTypewriter } from '../hooks/useTypewriter';

function PressStartTitle() {
  // Define o texto completo de cada palavra
  const fullText1 = "DESCUBRA";
  const fullText2 = "SEU";
  const fullText3 = "CURSO";
  
  // Atrasos e velocidade (50ms por caractere é um bom padrão)
  const speed = 50;
  const buffer = 150; // Pequeno buffer de tempo entre as palavras

  // Calcula os atrasos
  const delay1 = 0;
  const delay2 = fullText1.length * speed + buffer; // Atraso após o fim de DESCUBRA
  const delay3 = delay2 + fullText2.length * speed + buffer; // Atraso após o fim de SEU

  // Aplica o efeito Typewriter
  const text1 = useTypewriter(fullText1, speed, delay1);
  const text2 = useTypewriter(fullText2, speed, delay2);
  const text3 = useTypewriter(fullText3, speed, delay3);

  // Determina se o título completo está visível
  const isTitleComplete = text3 === fullText3;

  return (
    <>
      <h1 className="title">
        {/* Renderiza as três palavras, dependendo do hook para começar a digitação */}
        <span className="word delay1">{text1}</span><br />
        <span className="word delay2">{text2}</span>
        <br />
        <span className="word delay3 end">{text3}</span>
      </h1>
      {/* O "PRESS START" só aparece depois que o título estiver completo */}
      {isTitleComplete && (
        <p className="press">PRESS START</p>
      )}
    </>
  );
}

export default PressStartTitle;