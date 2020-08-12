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

// Cria a rota principal do HOME
app.get("/", (req, res) =>{
   Article.findAll({
       order:[
           ['id','DESC']//  Ordenando os artigos por id mais recente
       ],
       limit: 4
   }).then(articles => {
     Category.findAll().then(categories =>{// Pega as categorias no banco
        // Passa as categorias para a view junto com os artigos
        res.render("index", {articles: articles, categories: categories});
     })
   });
});

// Para usar as rotas da categoria criada em outro arquivo
app.use("/", categoriesController);

// Para usar as rotas da article criada em outro arquivo
app.use("/", articleController);

// Rota para abrir o artigo via slug
app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    
    // Pesquisa um artigo no banco quando o slug passado for igual a um slug do banco
    Article.findOne({
        where: {
            slug: slug // quando o slug for igual o slug
        }
    }).then(article => {// se der certo 
        if(article != undefined){ // Verifica se o artigo é diferente de indefinido 
            Category.findAll().then(categories =>{// Pega as categorias no banco
                // Passa as categorias para a view junto com os artigos
                res.render("article", {article: article, categories: categories});
             })
        }else{
            res.redirect("/");
        }
    }).catch( err =>{ // Se der erro
        res.redirect("/");
    });
})

// Cria uma rota para listar os artigos por categoria
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({ // Pesquisa por uma categoria no banco
        where: {
            slug: slug // Quando o slug do banco for igual o slug postado
        },
        include: [{model: Article}]// Fazendo o JOIN do artigo na busca de categoria
    }).then( category => { // Caso retorne algo
        if(category != undefined){// Verifica se a categoria existe
            // lista as categorias para mostrar no navbar
            Category.findAll().then(categories => {
                // Passa para a view os artigos daquela categoria
                res.render("index",{articles: category.articles, categories: categories});
            });
        }else{
            res.redirect("/");// caso não retorne nada volta para page inicial
        }
    }).catch(err => { // Caso de erro retorne para principal
        res.redirect("/");
    })
})

// Define a porta que o servidor vai rodar
app.listen(4000, () =>{
    console.log("O servidor está rodando");
});