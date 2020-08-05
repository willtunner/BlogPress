// Importa o express para criar o servidor
const express = require("express");
const app = express();
// Importa o body-parser
const bodyParser = require("body-parser");

// Define o ejs como view engine
app.set('view engine', 'ejs');

// Configura os arquivos staticos para pasta publica css, js etc...
app.use(express.static('public'));

// Configura o bodyparser
app.use(bodyParser.urlencoded({extends: false}));// Aceita dados do formulario
app.use(bodyParser.json());// Aceita dados em Json

// Cria a rota principal com uma msg
app.get("/", (req, res) =>{
    // Renderiza o HTML index.ejs dentro da pasta views
    res.render("index");
});

// Define a porta que o servidor vai rodar
app.listen(4000, () =>{
    console.log("O servidor está rodando");
});