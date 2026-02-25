import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Perfil = sequelize.define(
  'Perfil',
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
      unique: true, // ADMIN, USER, FORN
    },
  },
  {
    tableName: 'perfil',
    timestamps: true,
  }
);
