import React, { useState } from 'react';
import axios from 'axios';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'

  const { name, email, message } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/messages', formData);
      setSubmissionStatus('success');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Erro ao enviar a mensagem:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl mx-auto my-10">
      <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-4">
        Fale Conosco
      </h1>
      <p className="mt-2 text-center text-sm text-gray-600 mb-8">
        Tem alguma dúvida, sugestão ou feedback? Entre em contato conosco.
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Seu Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Seu Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={onChange}
            rows="4"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800"
          >
            Enviar Mensagem
          </button>
        </div>
      </form>

      {submissionStatus === 'success' && (
        <p className="mt-4 text-center text-sm text-green-600">Mensagem enviada com sucesso! Em breve entraremos em contato.</p>
      )}
      {submissionStatus === 'error' && (
        <p className="mt-4 text-center text-sm text-red-600">Erro ao enviar a mensagem. Por favor, tente novamente.</p>
      )}
    </div>
  );
}

export default ContactPage;