import React from 'react';

function AboutPage() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto my-10">
      <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-6">
        Sobre o Init.dev
      </h1>
      <p className="mt-4 text-gray-600 text-lg leading-relaxed">
        O Init.dev é uma plataforma de ensino de tecnologia que oferece cursos totalmente gratuitos e acessíveis a todas as pessoas, desde iniciantes absolutos até quem busca aprimorar suas habilidades. Nossa missão é democratizar o acesso ao conhecimento em programação e desenvolvimento, proporcionando uma experiência de aprendizado completa e direcionada ao mercado de trabalho.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-darkslateblue mb-4">
          O que a plataforma oferece:
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-600 text-lg">
          <li>
            <strong className="text-darkslateblue">Cursos Essenciais:</strong> Oferecemos uma ementa diversificada, começando com fundamentos como Lógica de Programação, HTML e CSS, e avançando para linguagens como JavaScript, Python e Java.
          </li>
          <li>
            <strong className="text-darkslateblue">Aprendizado Interativo:</strong> O conteúdo é construído para ser prático e envolvente. Você terá acesso a aulas dinâmicas, material resumido e atualizado, quizzes para testar seu conhecimento e projetos práticos para construir seu portfólio.
          </li>
          <li>
            <strong className="text-darkslateblue">Preparação para a Carreira:</strong> Além do código, a plataforma foca no que realmente importa para conseguir uma vaga. Oferecemos dicas sobre como otimizar seu perfil no LinkedIn, ferramentas e estratégias para criar um portfólio de destaque e conselhos sobre networking.
          </li>
          <li>
            <strong className="text-darkslateblue">Certificação Gratuita:</strong> Acreditamos que seu esforço merece reconhecimento. Após a conclusão dos requisitos de um curso, você terá direito a um certificado de conclusão, que validará suas novas habilidades.
          </li>
        </ul>
      </div>

      <p className="mt-8 text-gray-600 text-lg leading-relaxed">
        O Init.dev é mais do que um site de cursos; é um ecossistema completo para quem quer começar ou evoluir na carreira de tecnologia, com a confiança de que terá o suporte e as ferramentas necessárias para ter sucesso.
      </p>
    </div>
  );
}

export default AboutPage;