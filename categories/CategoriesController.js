const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express
const Catregory = require("./Category");// Importa o model da categoria
const slugify = require("slugify");

/**
 * CRIA AS ROTAS PARA A PARTE DE CATEGORIAS
 */

 // Cria a rota de categoria
 router.get("/categories", (req, res) => {
     res.send("ROTA DE CATEGORIAS")
 });

 // Cria a rota para criar uma nova categoria
 router.get("/admin/categories/new", (req, res) => {
    // Escreve algo na pagina criada
    //res.send("ROTA PARA CRIAR UMA NOVA CATEGORIA")

    // Renderiza um html criado na pasta abaixo
    res.render("admin/categories/new");
});

// Recomentado sempre usar post para formularios
router.post("/categories/save", (req, res) => {

    // pega o titulo da categoria do formulario pelo body-parser
    var title = req.body.title;

    // Se o titulo for diferente de nulo
    if(title != undefined){

        Catregory.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/");
        })
    }else{
        res.redirect("/admin/categories/new");
    }
});

module.exports = router;