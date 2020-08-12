const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express
const Category = require("../categories/Category"); // Importa as categorias para ter acesso quando for criar artigo
const Article = require("./Article");// Importa o model do artigo
const slugfi = require("slugify");// Importa o slugfy
const { default: slugify } = require("slugify");

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

// Cria rota para chamar a tela de edição passando os dados necessários
router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article })
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

// Cria rota para savar os dados editados no banco
router.post("/articles/update", (req, res) => {
    // pega as vareaveis pelo nome dos campos na view
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    // Faz update na tabela artigo passando os dados a serem editado
    Article.update({ title: title, body: body, categoryId: category, slug: slugify(title) }, {
        where: {
            id: id // Quando o id for igual o id passado
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});


// Faz a parte da paginação
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;// Vem no formato string
    var offset = 0;// Apartir de qual numero ele vai começar

    if (isNaN(page) || page == 1) {
        offset = 0;// Começa com zero para puxar os 4 primeiros
    } else {
        // offset vai ser igual o valor passado na rota
        // multiplicado por 4 que é o numero de elementos que tem na página
        offset = parseInt(page) * 4; //parseInt converte de string para numerico
    }

    // findAndCountAll: dar um select com um count
    Article.findAndCountAll({
        limit: 4, // Da um limite de 4 artigos
        offset: offset // Retorna 4 artigos apartir do décimo
    }).then(articles => {

        // Verifica se existe uma outra página depois da pagina atual
        var next;
        // Pega o ofsser e soma com a quantidade de elementos de uma págona
        // For maior do que a contagem de artigos
        if (offset + 4 >= articles.count) {// Count: consegue por conta do findAndCountAll
            next = false;// se ultrapassar a quantidade de artigos
        } else {
            next = true;
        }

        // Vareavel que recebe os artigos 
        var result = {
            offset: offset,
            next: next,
            articles: articles
        }

        res.json(result); // Retorna a resposta em formato json
    })
})

module.exports = router;