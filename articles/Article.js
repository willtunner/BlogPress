const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{// SLUG: pega o titulo e transforma em url ex: Fui almoçar = fui-almoçar
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// Categoria pertence a muitos artigos
Category.hasMany(Article);
// Um artigo pertence a uma Category
Article.belongsTo(Category);


// Usado para criar as tabelas, depois de criar temos que remover
//Article.sync({force: true});

module.exports = Article;