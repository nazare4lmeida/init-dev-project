import React, { useState } from 'react';
import axios from 'axios';

function AccessRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
  });
  const [message, setMessage] = useState('');

  const { name, email, username } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/access', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || 'Erro ao enviar a solicitação.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto my-10">
      <h2 className="text-3xl font-extrabold text-teal-700 text-center">
        Solicitar Acesso
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Preencha o formulário para ter acesso à plataforma.
      </p>

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Nome</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Seu nome"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Seu email"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="sr-only">Nome de Usuário</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Nome de usuário"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800"
          >
            Enviar Solicitação
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export default AccessRequestPage;