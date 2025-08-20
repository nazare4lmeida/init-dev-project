import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Se quiser usar ícones, instale o react-icons

function NotesPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const { title, content } = formData;
  const notes = []; // Esta lista será preenchida com dados do backend

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-darkslateblue">
            Meu Bloco de Anotações
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-600">
            Anote suas ideias e códigos.
          </p>
        </div>

        {/* Formulário para Adicionar Anotações */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto my-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="sr-only">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="Título da anotação"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="sr-only">Conteúdo</label>
              <textarea
                id="content"
                name="content"
                rows="5"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Sua anotação aqui..."
                value={content}
                onChange={onChange}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-600"
              >
                Salvar Anotação
              </button>
            </div>
          </form>
        </div>

        {/* Seção de Anotações Existentes */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Minhas Anotações</h2>
          {notes.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhuma anotação encontrada. Comece a criar uma!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-700">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesPage;