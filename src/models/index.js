import { Produto } from "./Produto";
import { Categoria } from "./Categoria";

Categoria.hasMany(Produto, {
    foreignKey:'categoria_id'
})

Produto.belongsTo(Categoria, {
    foreignKey:'categoria_id'
})

export {Categoria,Produto}
