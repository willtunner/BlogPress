const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express
const Category = require("../categories/Category"); // Importa as categorias para ter acesso quando for criar artigo
const Article = require("./Article");// Importa o model do artigo
const slugfi = require("slugify");// Importa o slugfy

/**
 * CRIA AS ROTAS PARA A PARTE DE CATEGORIAS
 */

// Cria a rota de Artigos
router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles });
    });
});

// Cria a rota para criar uma novo artigo
router.get("/admin/articles/new", (req, res) => {
    // Pesquisa pelo findAll todas as categorias 
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories });
    })
});

// Cria a rota para salvar o artigo
router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,// titulo vindo do input 
        slug: slugfi(title), // slug criado apartir do titulo
        body: body,// Corpo da mensagem vindo do textarea
        categoryId: category // Chave primaria da categoria criada no model do artigo Article.belongsTo(Category);
    }).then(() => {
        res.redirect("/admin/articles/");
    });
})

// Cria rota para excluir um artigo
router.post("/articles/delete", (req, res) => {
    var id = req.body.id;

    if (id != undefined) {// Se o valor for diferente de nulo
        if (!isNaN(id)) {

            Article.destroy({// EXCLUI CATEGORIA DA TABELA DB
                where: {
                    id: id // Quando o id for igual o id vindo do form
                }
            }).then(() => {
                res.redirect("/admin/articles");// Se der certo redireciona para categorias
            });

        } else {// Se não for um número
            res.redirect("/admin/articles");
        }
    } else {// Se for nulo/NULL
        res.redirect("/admin/articles");
    }
});

//Cria rota para editar um artigo
router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article})
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});


module.exports = router;