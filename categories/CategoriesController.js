const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express
const Category = require("./Category");// Importa o model da categoria
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");// Importa os middlewares

/**
 * CRIA AS ROTAS PARA A PARTE DE CATEGORIAS
 */

 // Cria a rota de categoria
 router.get("/categories", adminAuth, (req, res) => {
     res.send("ROTA DE CATEGORIAS")
 });

 // Cria a rota para criar uma nova categoria
 router.get("/admin/categories/new", adminAuth, (req, res) => {
    // Escreve algo na pagina criada
    //res.send("ROTA PARA CRIAR UMA NOVA CATEGORIA")

    // Renderiza um html criado na pasta abaixo
    res.render("admin/categories/new");
});

// Recomentado sempre usar post para formularios
router.post("/categories/save", adminAuth, (req, res) => {

    // pega o titulo da categoria do formulario pelo body-parser
    var title = req.body.title;

    // Se o titulo for diferente de nulo
    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new");
    }
});

// Cria rota para listar as categorias cadastradas
router.get("/admin/categories", adminAuth, (req, res) =>{
    // findAll = select * from
    Category.findAll().then(categories => {
        // Passa para o html tudo que retorna do sql na vareavel categories
        res.render("admin/categories/index", {categories: categories});
    });
});

// Cria rota para excluir uma categoria
router.post("/categories/delete", adminAuth, (req, res) => {
    var id = req.body.id;

    if(id != undefined){// Se o valor for diferente de nulo
        if(!isNaN(id)){

            Category.destroy({// EXCLUI CATEGORIA DA TABELA DB
                where: {
                    id: id // Quando o id for igual o id vindo do form
                }
            }).then(() => {
                res.redirect("/admin/categories");// Se der certo redireciona para categorias
            });

        }else{// Se não for um número
            res.redirect("/admin/categories");
        }
    }else{// Se for nulo/NULL
        res.redirect("/admin/categories");
    }
});

// Cria a rota para editar uma categoria
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    // Pega o id vindo na url
    var id = req.params.id;

    // Valida se o valor é somente numero
    if(isNaN(id)){
        res.redirect("/admin/categories");// Se não for ele redireciona
    }

    // findByPk: pesquisa pelo id
    Category.findByPk(id).then(category => {
        if(category != undefined){
            // Chama a rota edit e passa os dados da category para ela
            res.render("admin/categories/edit", { category: category});
        }else{
            // Redireciona a pagina
            res.redirect("/admin/categories");
        }
    }).catch( erro => {
        // Redireciona a pagina
        res.redirect("/admin/categories");
    })
});

// Cria a rota para dar o update no banco
router.post("/categories/update", adminAuth, (req, res) => {
    var id = req.body.id;// Pega o id da categoria
    var title = req.body.title;// Pega o titulo alterado da categoria

    // Faz um update na tabela categoria
    // Atualiza tb o slug usando o slugify
    Category.update({title: title, slug: slugify(title)},{// Diz que quer atualizar o campo title do banco e recebe a vareavel title
        where: {
            id: id // Quando o id do banco for igual o id retornado
        }
    }).then(() => {
        res.redirect("/admin/categories");// Se não for ele redireciona
    })
})

module.exports = router;