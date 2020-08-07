const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express
const Category = require("../categories/Category"); // Importa as categorias para ter acesso quando for criar artigo
const Article = require("./Article");// Importa o model do artigo
const slugfi = require("slugify");// Importa o slugfy

/**
 * CRIA AS ROTAS PARA A PARTE DE CATEGORIAS
 */

 // Cria a rota de categoria
 router.get("/articles", (req, res) => {
     res.send("ROTA DE ARTICLES")
 });

 // Cria a rota para criar uma nova categoria
 router.get("/admin/articles/new", (req, res) => {
     // Pesquisa pelo findAll todas as categorias 
     Category.findAll().then(categories => {
         res.render("admin/articles/new", {categories: categories});
     })
});

// Cria a rota para salvar o artigo
router.post("/articles/save", (req, res) =>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        tile: title,// titulo vindo do input 
        slug: slugfi(title), // slug criado apartir do titulo
        body: body,// Corpo da mensagem vindo do textarea
        categoryId: category // Chave primaria da categoria criada no model do artigo Article.belongsTo(Category);
    }).then(() => {
        res.redirect()
    });
})

module.exports = router;