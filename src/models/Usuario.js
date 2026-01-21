import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Usuario = sequelize.define('Usuario', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: { isEmail: true },
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // adicionar coluna cpf com validação
        cpf: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                //validate apenas que tem que conter 11 caracteres sem os caracteres especiais
                len: {
                    args: [11, 11],
                    msg: 'CPF deve conter 11 caracteres',
                }
            }
        }
    },
    {
        tableName: 'usuarios',
        timestamps: true,
    }
);
