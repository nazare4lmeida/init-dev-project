import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, Terminal, Sparkles, XCircle, RefreshCw } from 'lucide-react';

// --- IMPORTAÇÕES DOS SEUS NOVOS ARQUIVOS ---
import Quiz from '../components/Quiz';
import CodeEditor from '../components/CodeEditor';

export default function LessonPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // --- MOCK DE DADOS ---
    const mockData = {
      id: id || "1",
      title: id === "react-101" ? "Fundamentos do React" : "Introdução às Variáveis",
      content: `
        <h2 class="text-2xl font-bold mb-4 text-indigo-900">Conceito Fundamental</h2>
        <p class="mb-4 text-gray-700 leading-relaxed">
            Variáveis são essenciais em qualquer linguagem de programação. 
            No JavaScript moderno (ES6+), usamos <code>let</code> e <code>const</code>.
        </p>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
            <h3 class="font-bold text-blue-900">Dica Pro:</h3>
            <p class="text-sm text-blue-800">Sempre prefira <code>const</code> por padrão.</p>
        </div>
      `,
      codeChallenge: {
        initialCode: `// Desafio: Crie uma constante PI\nconst PI = 3.14;\n// Tente mudar o valor abaixo para ver o erro:\n// PI = 3.15;`,
        language: "javascript",
        solutionHint: "Lembre-se que 'const' exige um valor inicial e não pode ser alterado depois."
      },
      quiz: {
        question: "Qual declaração gera um erro se tentarmos reatribuir o valor?",
        options: ["var nome = 'Ana';", "let idade = 25;", "const PI = 3.14;"],
        correctIndex: 2,
        explanation: "Variáveis declaradas com 'const' são de leitura única (read-only) para reatribuição."
      }
    };

    const timer = setTimeout(() => {
      setLesson(mockData);
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-indigo-600 gap-4">
            <RefreshCw className="animate-spin" size={32} />
            <span className="font-medium animate-pulse">Carregando conteúdo...</span>
        </div>
    );
  }

  if (!lesson) return (
    <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100 text-red-600 mt-8">
        <XCircle className="mx-auto mb-2" size={32} />
        <h2 className="font-bold text-lg">Aula não encontrada</h2>
        <button onClick={() => navigate('/courses')} className="mt-4 underline hover:text-red-800">Voltar aos cursos</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Cabeçalho da Aula */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition text-sm font-medium gap-1"
        >
          <ChevronLeft size={18} /> Voltar
        </button>
        
        <h1 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 truncate">
          <BookOpen size={22} className="text-indigo-500 flex-shrink-0" />
          <span className="truncate">{lesson.title}</span>
        </h1>
        
        <button className="flex items-center bg-indigo-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm gap-1 shadow-sm shadow-indigo-200">
          Próxima <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna da Esquerda: Conteúdo e Quiz */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo max-w-none">
               <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <CheckCircle className="text-teal-500" size={20} />
              <h3 className="font-bold text-slate-700 text-lg">Quiz Rápido</h3>
            </div>
            {/* USANDO O COMPONENTE IMPORTADO */}
            <Quiz questionData={lesson.quiz} />
          </div>
        </div>

        {/* Coluna da Direita: Editor de Código */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between text-slate-700">
               <div className="flex items-center gap-2 font-bold">
                 <Terminal size={20} className="text-indigo-600" /> 
                 Pratique Agora
               </div>
               <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold uppercase">
                 {lesson.codeChallenge?.language}
               </span>
            </div>
            
            {/* USANDO O COMPONENTE IMPORTADO */}
            <CodeEditor 
              initialCode={lesson.codeChallenge?.initialCode}
              language={lesson.codeChallenge?.language}
            />
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start shadow-sm">
              <Sparkles size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">Dica do Professor</h4>
                <p className="text-sm text-blue-800 leading-relaxed">{lesson.codeChallenge?.solutionHint}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}