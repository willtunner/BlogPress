const express = require("express");// Importa o express
const router = express.Router();// Importa o Router do express

/**
 * CRIA AS ROTAS PARA A PARTE DE CATEGORIAS
 */

 // Cria a rota de categoria
 router.get("/categories", (req, res) => {
     res.send("ROTA DE CATEGORIAS")
 });

 // Cria a rota para criar uma nova categoria
 router.get("/admin/categories/new", (req, res) => {
    res.send("ROTA PARA CRIAR UMA NOVA CATEGORIA")
});

module.exports = router;