const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express

/**
 * CRIA AS ROTAS PARA A PARTE DE CATEGORIAS
 */

 // Cria a rota de categoria
 router.get("/articles", (req, res) => {
     res.send("ROTA DE ARTICLES")
 });

 // Cria a rota para criar uma nova categoria
 router.get("/admin/articles/new", (req, res) => {
    res.send("ROTA PARA CRIAR UMA NOVA ARTICLES")
});

module.exports = router;