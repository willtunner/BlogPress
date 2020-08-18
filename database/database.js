/**
 * LOCAL
 */

// Importa o sequelize para trabalhar com banco de dados
// const Sequelize = require("sequelize");

// // Cria a conexão com o banco 
// const connection = new Sequelize('guiapress', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     timezone: '-03:00'
// });

// // Exporta para ser chamado em outras telas
// module.exports = connection;


/**
 * UMBLER
 */
// Importa o sequelize para trabalhar com banco de dados
const Sequelize = require("sequelize");

// Cria a conexão com o banco 
const connection = new Sequelize('greencodeblog', 'willtunner', 'lft11790', {
    host: 'mysql669.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00'
});

// Exporta para ser chamado em outras telas
module.exports = connection;