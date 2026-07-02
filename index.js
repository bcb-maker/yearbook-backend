import express from 'express';
import logger from './middlewares/logger.js';
import alunosRouter from './routes/alunos.js';

const app = express();
const PORT = 3000;

app.use(express.json()); // parseia JSON
app.use(logger);         // registra o log de cada requisição

// rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'Yearbook API está no ar! 🎓' });
});

// rota de health check
app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// rotas de alunos
app.use('/alunos', alunosRouter);

// inicia o servidor localmente
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// exporta o app para a Vercel usar como serverless function
export default app;