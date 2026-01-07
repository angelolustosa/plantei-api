import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Produto = sequelize.define('produto', {
    nome: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            //notNull: { msg: "Nome do produto é obrigatório" },  // <- ADICIONE ISTO
            notEmpty: { msg: "Nome do produto é obrigatório"},
            len: {
                args: [3, 150],
                msg: "Nome deve ter entre 3 e 150 caracteres"
            }
        }
    },
    descricao: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: 'Preço inválido'},
            min: {
                args: [0],
                msg: "Preço deve ser maior ou igual a zero."
            }
        }
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Estoque não pode ser negativo."
            }
        }
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: {
                msg: "URl da imagem inválida"
            }
        }
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

})