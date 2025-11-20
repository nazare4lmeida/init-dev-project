import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react"; // Requer: npm install @monaco-editor/react
import { Terminal, Sparkles, Play } from 'lucide-react';

const CodeEditor = ({ 
  initialCode = "// Escreva seu código aqui...", 
  language = "javascript", 
  onRunCode 
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza o código interno se a prop mudar (ex: mudou de aula)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleRun = () => {
    // Em um cenário real de JS, usaríamos 'eval' com cuidado ou um sandbox.
    // Para HTML, injetamos no iframe.
    setOutput(code);
    if (onRunCode) onRunCode(code);
  };

  // Executa ao montar
  useEffect(() => {
    handleRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAiHelp = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert("🤖 IA Init.dev: 'Dica: Verifique se você fechou todas as chaves e parênteses corretamente.'");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-0 h-[500px] w-full shadow-xl rounded-xl overflow-hidden border border-slate-200 bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-slate-800 p-3 border-b border-slate-700 text-white">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-teal-400" />
          <span className="font-semibold tracking-wide text-sm">Editor: {language}</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAiHelp}
            className="flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded transition-colors"
          >
            {isLoading ? <span className="animate-pulse">Pensando...</span> : <><Sparkles size={14} /> Ajuda IA</>}
          </button>
          <button 
            onClick={handleRun}
            className="flex items-center gap-2 text-xs bg-teal-600 hover:bg-teal-500 px-4 py-1.5 rounded font-bold transition-colors shadow-lg shadow-teal-900/20"
          >
            <Play size={14} /> RUN
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-rows-2 md:grid-rows-none md:grid-cols-2 h-full">
        {/* Área do Editor (Monaco) */}
        <div className="h-full border-r border-slate-700">
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Área de Preview / Console */}
        <div className="h-full bg-white flex flex-col relative">
          <div className="bg-gray-100 px-3 py-1 text-xs text-gray-500 border-b flex justify-between select-none">
            <span>Output / Preview</span>
            <div className="flex gap-1 pt-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
          </div>
          
          {/* Se for HTML renderiza iframe, se for JS mostra console simples (simulado) */}
          {language === 'html' ? (
              <iframe
                title="Preview"
                srcDoc={output}
                className="w-full h-full bg-white"
                sandbox="allow-scripts"
              />
          ) : (
              <div className="p-4 font-mono text-sm text-gray-800 w-full h-full overflow-auto bg-gray-50">
                  <p className="text-gray-400 text-xs mb-2">// Resultado da execução:</p>
                  {output || <span className="text-gray-400 italic">Clique em RUN para ver o resultado...</span>}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;