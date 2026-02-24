import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Permissao = sequelize.define(
  'Permissao',
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
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ex: produto_criar
    },
  },
  {
    tableName: 'permissoes',
    timestamps: false,
  }
);