// src/routes/chamadoRoutes.js
import express from 'express';
import chamadoController from '../controllers/chamadoController.js';
const router = express.Router();

// Rota para o cliente se inscrever para receber atualizações em tempo real (SSE)
router.get('/events', chamadoController.handleEvents);

// --- API REST para Chamados ---

// Rota para buscar a lista de chamados (com paginação e filtro)
router.get('/', chamadoController.getChamados);

// Rota para buscar um chamado específico pelo seu ID
router.get('/:id', chamadoController.getChamadoById);

// Rota para criar um novo chamado
router.post('/', chamadoController.createChamado);

// Rota para atualizar parcialmente um chamado (ex: mudar estado)
router.patch('/:id', chamadoController.updateChamado);

// Rota para deletar um chamado
router.delete('/:id', chamadoController.deleteChamado);

export default router;