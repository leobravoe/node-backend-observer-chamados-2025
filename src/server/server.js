// src/server/server.js

// 1. Centralize a configuração do dotenv aqui, no topo do arquivo.
// Isso garante que TODAS as variáveis de ambiente sejam carregadas
// antes que qualquer outro módulo do seu aplicativo seja importado.
import dotenv from 'dotenv';
dotenv.config();

// 2. O restante das importações vem depois.
import express from 'express';
import cors from 'cors';
import chamadoRoutes from '../routes/chamadoRoutes.js'; // Ajuste o caminho se necessário
import sseService from '../services/sseService.js';   // Ajuste o caminho se necessário

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send('OK from Express Backend');
});

app.use('/api/chamados', chamadoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
    sseService.initialize();
});