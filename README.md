# Init.dev

Uma plataforma educacional completa para auxiliar estudantes de tecnologia, com foco em lógica de programação e desenvolvimento web. O projeto oferece material de estudo, videoaulas e um bloco de anotações interativo para ajudar os alunos a construir suas carreiras.

---

## Funcionalidades

* **Autenticação de Usuário:** Sistema completo de registro e login.
* **Bloco de Anotações Interativo:** Um espaço pessoal para cada estudante registrar suas anotações.
* **Materiais de Curso:** Seções dedicadas a conteúdos, videoaulas e guias.
* **Plataforma de Certificação:** Sistema embutido para emissão de certificados após a conclusão dos cursos.

---

## Tecnologias Utilizadas

O projeto é construído com a MERN Stack, uma das pilhas de tecnologia mais populares e robustas do mercado.

### Front-end
* **React:** Biblioteca JavaScript para a interface de usuário.
* **Vite:** Ferramenta para um desenvolvimento mais rápido.
* **React Router Dom:** Gerenciamento de navegação e rotas.
* **Axios:** Cliente HTTP para comunicação com a API.

### Back-end
* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express:** Framework para construir a API.
* **MongoDB:** Banco de dados NoSQL flexível e escalável.
* **Mongoose:** Biblioteca para modelagem de dados do MongoDB.
* **Bcrypt.js:** Para criptografia de senhas.
* **Jsonwebtoken:** Para autenticação de usuários via tokens JWT.

---

## Pré-requisitos

Para rodar o projeto localmente, você precisa ter o seguinte instalado:
* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* npm (já vem com o Node.js)
* Uma instância do MongoDB (local ou em nuvem via MongoDB Atlas)

---

## Instalação e Configuração

Siga os passos abaixo para configurar o projeto.

### 1. Clonar o Repositório
```bash
git clone <URL-do-seu-repositorio>
cd init-dev
```
2. Configurar o Back-end
Navegue até a pasta server e instale as dependências:

```bash
cd server
npm install
```

3. Crie um arquivo .env na pasta server com sua URL de conexão do MongoDB e sua chave secreta JWT:
```bash
MONGO_URI=sua_url_do_mongodb_atlas
JWT_SECRET=sua-chave-secreta-bem-longa-e-segura
```
4. Configurar o Front-end
Navegue até a pasta client e instale as dependências:

```bash

cd ../client
npm install
```
## Como Rodar o Projeto:

Você precisará de dois terminais.

Terminal 1: Rodar o Back-end
```bash

cd server
node server.js
```
O servidor será iniciado na porta 5000.

Terminal 2: Rodar o Front-end
```bash

cd client
npm run dev

```
O servidor do front-end será iniciado na porta 5173 e a aplicação abrirá no seu navegador.

## Processo de Certificação
A certificação do Init.dev é um processo que valida o conhecimento do aluno. Para obter o certificado, o estudante deverá:

1. Completar todos os módulos e videoaulas do curso.

2. Passar em um quiz de avaliação no final de cada módulo.

3. Concluir um projeto prático que demonstre o conhecimento adquirido (e que poderá servir para adicionar ao portfólio do(a) aluno(a)).
