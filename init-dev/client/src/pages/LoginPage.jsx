import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // A lógica de login virá aqui
    console.log(formData);
  };

  return (
    <section className='form'>
      <h1>Login</h1>
      <p>Acesse sua conta</p>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={email}
            placeholder='Seu email'
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={password}
            placeholder='Sua senha'
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-block'>
            Entrar
          </button>
        </div>
      </form>
      <div className='form-link'>
        <p>Ainda não tem uma conta? <Link to='/register'>Registre-se</Link></p>
      </div>
    </section>
  );
}

export default LoginPage;