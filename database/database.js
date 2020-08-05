// Importa o sequelize para trabalhar com banco de dados
const Sequelize = require("sequelize");

// Cria a conexão com o banco 
const connection = new Sequelize('guiapress', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Exporta para ser chamado em outras telas
module.exports = connection;
