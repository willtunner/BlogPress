// Importa o express para criar o servidor
const express = require("express");
const app = express();
// Importa o Controller da categoria
const categoriesController = require("./categories/CategoriesController");
// Importa o Controller da article
const articleController = require("./articles/ArticlesController");
// Importa o UsersController 
const usersController = require("./user/UsersController");
// Importa a parte de sessões/cookies
const session = require("express-session");


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


// Sessions
app.use(session({
    // secret: palavra usada para criar criptografia dando mais segurança
    // cookie: Diz que esse usuario tem sessão no servidor
    // maxAge: tempo para expirar
    secret: "greencode", cookie: {maxAge: 30000}
}));

// Pega esses dados e salva na sessão
// Toda a aplicação tem acesso
app.get("/session", (req, res) => {
    req.session.treinamento = "Formação nodeJs"
    req.session.ano = 2020
    req.session.email = "williampereira21@gmail.com"
    req.session.user = {
        username: "William",
        email: "greencode@gmail.com",
        id: 10
    }
    res.send("Sessão gerada!");// Toda rota obrigatório da uma resposta
});

// Sessão que pega os dados dos cookies gerados na sessão
app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
});





// Importa o body-parser
const bodyParser = require("body-parser");

// Define o ejs como view engine
app.set('view engine', 'ejs');

// Configura os arquivos staticos para pasta publica css, js etc...
app.use(express.static('public'));

// Configura o bodyparser
app.use(bodyParser.urlencoded({ extended: false }));// Aceita dados do formulario
app.use(bodyParser.json());// Aceita dados em Json

// Cria a rota principal do HOME
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']//  Ordenando os artigos por id mais recente
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {// Pega as categorias no banco
            // Passa as categorias para a view junto com os artigos
            res.render("index", { articles: articles, categories: categories });
        })
    });
});

// Para usar as rotas da categoria criada em outro arquivo
app.use("/", categoriesController);
// Para usar as rotas da article criada em outro arquivo
app.use("/", articleController);
// Para usar as rotas do users criada em outro arquivo
app.use("/", usersController);


// Rota para abrir o artigo via slug
app.get("/:slug", (req, res) => {
    var slug = req.params.slug;

    // Pesquisa um artigo no banco quando o slug passado for igual a um slug do banco
    Article.findOne({
        where: {
            slug: slug // quando o slug for igual o slug
        }
    }).then(article => {// se der certo 
        if (article != undefined) { // Verifica se o artigo é diferente de indefinido 
            Category.findAll().then(categories => {// Pega as categorias no banco
                // Passa as categorias para a view junto com os artigos
                res.render("article", { article: article, categories: categories });
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => { // Se der erro
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
        include: [{ model: Article }]// Fazendo o JOIN do artigo na busca de categoria
    }).then(category => { // Caso retorne algo
        if (category != undefined) {// Verifica se a categoria existe
            // lista as categorias para mostrar no navbar
            Category.findAll().then(categories => {
                // Passa para a view os artigos daquela categoria
                res.render("index", { articles: category.articles, categories: categories });
            });
        } else {
            res.redirect("/");// caso não retorne nada volta para page inicial
        }
    }).catch(err => { // Caso de erro retorne para principal
        res.redirect("/");
    })
})

// Define a porta que o servidor vai rodar: 4000 | umbler 3000
app.listen(3000, () => {
    console.log("O servidor está rodando");
});