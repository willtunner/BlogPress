const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('user',{// user: nome da tabela
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


// Usado para criar as tabelas, depois de criar temos que remover
// User.sync({force: true});

module.exports = User;