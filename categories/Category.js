const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{// SLUG: pega o titulo e transforma em url ex: Fui almoçar = fui-almoçar
        type: Sequelize.STRING,
        allowNull: false
    }
})


// Usado para criar as tabelas, depois de criar temos que remover
//Category.sync({force: true});

module.exports = Category;