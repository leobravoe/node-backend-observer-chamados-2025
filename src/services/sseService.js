// src/services/sseService.js

import { Client } from 'pg';

let clients = [];

const sendEventsToAll = (data) => {
    clients.forEach(client => {
        client.res.write(`event: chamado-update\n`);
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};

const addClient = (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    };
    res.writeHead(200, headers);
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);
    console.log(`[SSE] Cliente ${clientId} conectado. Total: ${clients.length}`);

    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
        console.log(`[SSE] Cliente ${clientId} desconectado. Total: ${clients.length}`);
    });
};

// --- LÓGICA DE ESCUTA DO BANCO DE DADOS CORRIGIDA ---

// 1. Apenas declaramos a variável aqui, sem criar o objeto.
let dbListenerClient;

const initialize = async () => {
    // Evita criar múltiplas conexões se a função for chamada mais de uma vez.
    if (dbListenerClient) {
        return;
    }
    
    try {
        // 2. A criação do cliente (new Client) foi MOVIDA para DENTRO da função.
        // Agora, ele só é criado quando initialize() é chamado,
        // garantindo que o dotenv.config() no server.js já foi executado.
        dbListenerClient = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        await dbListenerClient.connect();
        console.log('[DB Listener] Conectado ao PostgreSQL para escutar notificações.');

        await dbListenerClient.query('LISTEN chamados_channel');

        dbListenerClient.on('notification', (msg) => {
            console.log('[DB Listener] Notificação recebida do canal:', msg.channel);
            const payload = JSON.parse(msg.payload);
            sendEventsToAll(payload);
        });

    } catch (err) {
        console.error('[DB Listener] Erro ao conectar ou escutar o banco de dados:', err);
        process.exit(1);
    }
};

process.on('exit', () => {
    if (dbListenerClient) {
        dbListenerClient.end();
    }
});

export default {
    addClient,
    initialize,
};