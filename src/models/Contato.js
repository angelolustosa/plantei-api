import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Contato = sequelize.define('Contato', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Nome do contato é obrigatório" },
      len: {
        args: [3, 150],
        msg: "Nome deve ter entre 3 e 150 caracteres"
      }
    }
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: "E-mail é obrigatório" },
      isEmail: { msg: "E-mail inválido" }
    }
  },

  mensagem: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Mensagem é obrigatória" },
      len: {
        args: [1, 500],
        msg: "Mensagem deve ter no máximo 500 caracteres"
      }
    }
  }

}, {
  tableName: 'contatos',
  timestamps: true
});
