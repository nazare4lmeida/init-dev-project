import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const Quiz = ({ questionData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Previne erro se os dados não chegarem
  if (!questionData) return null;

  const { question, options, correctIndex, explanation } = questionData;

  const handleSubmit = () => {
    if (selectedOption !== null) setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const getOptionStyle = (index) => {
    let style = "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ";
    
    if (!isSubmitted) {
      return style + (selectedOption === index 
        ? "border-indigo-600 bg-indigo-50 text-indigo-800" 
        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50");
    }

    if (index === correctIndex) {
      return style + "border-teal-500 bg-teal-50 text-teal-800 font-medium"; 
    }
    if (selectedOption === index && index !== correctIndex) {
      return style + "border-red-500 bg-red-50 text-red-800"; 
    }
    return style + "border-gray-100 text-gray-400 opacity-50"; 
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-600 w-full">
      <h3 className="text-xl font-bold text-slate-800 mb-6">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((opt, idx) => (
          <div 
            key={idx} 
            onClick={() => !isSubmitted && setSelectedOption(idx)}
            className={getOptionStyle(idx)}
          >
            <span>{opt}</span>
            {isSubmitted && idx === correctIndex && <CheckCircle size={20} className="text-teal-600" />}
            {isSubmitted && selectedOption === idx && idx !== correctIndex && <XCircle size={20} className="text-red-500" />}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex-1 pr-4">
          {isSubmitted && (
             <div className={`text-sm p-3 rounded-md ${selectedOption === correctIndex ? 'bg-teal-50 text-teal-800' : 'bg-red-50 text-red-800'}`}>
               <strong>{selectedOption === correctIndex ? "Correto! 🎉" : "Incorreto 😔"}</strong>
               <p className="mt-1">{explanation}</p>
             </div>
          )}
        </div>

        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-2 rounded-lg font-bold text-white transition-colors
              ${selectedOption === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            Verificar
          </button>
        ) : (
          <button 
            onClick={handleReset}
            className="px-6 py-2 rounded-lg font-bold text-indigo-600 border border-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
          >
            <RotateCcw size={16} /> Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;