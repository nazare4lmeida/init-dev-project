import React from 'react';

function Dashboard() {
  return (
    <div className='container'>
      <section className='heading'>
        <h1>Bem-vindo, Aluno!</h1>
        <p>Comece sua jornada de aprendizado em tecnologia.</p>
      </section>

      <section className='dashboard-links'>
        <div className='dashboard-card'>
          <h3>Material de Estudo</h3>
          <p>Acesse o conteúdo completo e videoaulas.</p>
          <a href='/courses' className='btn btn-light'>Explorar Cursos</a>
        </div>
        <div className='dashboard-card'>
          <h3>Bloco de Anotações</h3>
          <p>Um espaço interativo para suas anotações.</p>
          <a href='/notes' className='btn btn-light'>Ir para Anotações</a>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;