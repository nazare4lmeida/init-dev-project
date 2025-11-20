const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const progressRoutes = require('./routes/progressRoutes');
const cors = require('cors');

dotenv.config({ path: './.env' });

// Verificação de segurança: Checa se a chave secreta foi carregada
if (!process.env.JWT_SECRET) {
  console.error('ERRO: JWT_SECRET não foi carregada. Verifique seu arquivo .env');
  process.exit(1);
}

// Conexão com o banco de dados
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/enroll', require('./routes/enrollmentRoutes'));
app.use('/api/access', require('./routes/accessRoutes'));
app.use('/api/progress', progressRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Rota de teste
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));