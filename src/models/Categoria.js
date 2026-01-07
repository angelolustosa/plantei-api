import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";


export const Categoria = sequelize.define('Categoria', {
    nome: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Nome do Categoria é obrigatório"},
            len: {
                args: [3, 150],
                msg: "Nome deve ter entre 3 e 150 caracteres"
            }
        }
    },
    descricao: {
        type: DataTypes.STRING(250),
        allowNull: true
    }
})