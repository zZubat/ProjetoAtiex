// zzubat/projetoatiex/ProjetoAtiex-52deada71db2eb486fff0a4c9e7ff14e37d0a383/src/components/DialogueBox.jsx
import React from 'react';

// Adiciona className às props
function DialogueBox({ children, choices = [], onChoice, onClick, className = '' }) {
  // Combina a classe padrão com qualquer classe adicional
  const boxClass = `dialogue-box ${className}`;

  return (
    <div className={boxClass} onClick={onClick}>
      {/* O conteúdo principal (texto da pergunta ou resultado) */}
      <div className="dialogue-content">
        {children}
      </div>

      {/* As opções de escolha (Sim/Não) */}
      {choices.length > 0 && (
        <div className="dialogue-choices">
          {choices.map((choice) => (
            <button
              key={choice.text}
              onClick={(e) => {
                  e.stopPropagation();
                  onChoice(choice.value);
              }}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DialogueBox;