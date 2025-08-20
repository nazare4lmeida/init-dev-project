import React, { useState } from 'react';

function NotesPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const { title, content } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Lógica para adicionar a anotação
    console.log(formData);
  };

  return (
    <div className='container'>
      <section className='heading'>
        <h1>Meu Bloco de Anotações</h1>
        <p>Anote suas ideias e códigos.</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='title'
              name='title'
              value={title}
              placeholder='Título da anotação'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <textarea
              className='form-control'
              id='content'
              name='content'
              value={content}
              placeholder='Sua anotação aqui...'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Salvar Anotação
            </button>
          </div>
        </form>
      </section>

      <section className='notes-list'>
        <h3>Minhas Anotações</h3>
        {/* As anotações aparecerão aqui */}
      </section>
    </div>
  );
}

export default NotesPage;