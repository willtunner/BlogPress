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

module.exports = Category;