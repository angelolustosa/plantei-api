import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL_DB || process.env.DATABASE_URL;

// Exige SSL apenas se especificado na URL (Neon) ou fora de testes
const useSSL = BASE_URL && BASE_URL.includes('sslmode=require');

export const sequelize = new Sequelize(
    BASE_URL,
    {
        dialect: 'postgres',
        dialectOptions: useSSL ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {},
        logging: process.env.NODE_ENV !== 'test'
    }
);