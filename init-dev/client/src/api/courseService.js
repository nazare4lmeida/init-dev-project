// Este é um serviço de exemplo.
// Por enquanto, não faremos requisições a API, mas a estrutura já está pronta.
const getCourses = () => {
  return [
    { id: 1, title: 'Lógica de Programação', description: 'Fundamentos essenciais.' },
    { id: 2, title: 'Introdução ao Front-end', description: 'HTML, CSS e JavaScript.' },
  ];
};

const courseService = {
  getCourses,
};

export default courseService;