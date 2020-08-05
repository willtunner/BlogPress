// Importa o express para criar o servidor
const express = require("express");
const app = express();
// Importa o Controller da categoria
const categoriesController = require("./categories/CategoriesController");
// Importa o Controller da article
const articleController = require("./articles/ArticlesController");

// Importa os models do artigo e categoria
const Article = require("./articles/Article");
const Category = require("./categories/Category");

// Importa a conexão com banco de dados
const connection = require("./database/database");

// Chama a conexão do banco no projeto
connection
        .authenticate()
        .then(() => {// Caso de certo mostra msg
            console.log("Conexão feita com sucesso!");
        }).catch((error) => {// Caso de erro mostra o erro
            console.log(error);
        });


// Importa o body-parser
const bodyParser = require("body-parser");

// Define o ejs como view engine
app.set('view engine', 'ejs');

// Configura os arquivos staticos para pasta publica css, js etc...
app.use(express.static('public'));

// Configura o bodyparser
app.use(bodyParser.urlencoded({extended: false}));// Aceita dados do formulario
app.use(bodyParser.json());// Aceita dados em Json

// Cria a rota principal com uma msg
app.get("/", (req, res) =>{
    // Renderiza o HTML index.ejs dentro da pasta views
    res.render("index");
});

// Para usar as rotas da categoria criada em outro arquivo
app.use("/", categoriesController);

// Para usar as rotas da article criada em outro arquivo
app.use("/", articleController);



// Define a porta que o servidor vai rodar
app.listen(4000, () =>{
    console.log("O servidor está rodando");
});