// src/database.js

import pg from 'pg';
import chalk from 'chalk'; // <-- CORREÇÃO: Importação do chalk adicionada.

const { Pool } = pg;

let pool;

const getPool = () => {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
        // Agora o chalk está definido e esta linha funcionará.
        console.log(chalk.blue('[DB Pool] Pool de conexões principal inicializado com sucesso.'));
    }
    return pool;
};

const db = {
    query: (text, params) => {
        const poolInstance = getPool();
        return poolInstance.query(text, params);
    },
};

export default db;