const express = require("express");
const router = express.Router();
const User = require("./Use");// Importa o model user
const bcrypt = require("bcryptjs");// Importa para criar o hash da senha

// Cria a rota para usuarios
router.get("/admin/users", (req, res) => {
    User.findAll().then( users => {
        res.render("admin/users/index", {users: users});
    });
});

// Cria a rota para criar usuarios
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

// Cria a rota post para receber os dados do formulários
router.post("/users/create", (req, res) => {
    // Pega os valores do formulário pelo name deles
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({// Procura um usuario 
        where: { email: email }// quando o email do banco for igual ao email do formulário
    }).then(user => {

        if (user == undefined) {// se for undefined/não existe, não está cadastrado no banco, pode cadastrar
            // Adiciona uma força 10 para gerar segurança na senha
            var salt = bcrypt.genSaltSync(10);
            // Cria o hash usando o salt ampliando a segurança
            var hash = bcrypt.hashSync(password, salt);

            // Salva no banco de dados
            User.create({
                email: email,
                password: hash
            }).then(() => {// se der certo
                res.redirect("/");
            }).catch((err) => {// se der errado
                res.redirect("/");
            });
        } else {
            res.redirect("/admin/users/create");
        }

    })



    // Testa se os dados estão vindo certo 
    //res.json({email, password});
});

// Renderiza a tela de login
router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

// Rota para fazer o login
router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    // Pesquisa se existe um usuario com esse email no banco
    User.findOne({where:{email: email}}).then(user => {

        if(user != undefined){// Se existe um usuario com esse email
            //Verifica se a senha que o usuario passou é igual a cadastrada no banco
            var correct = bcrypt.compareSync(password, user.password);

            // Se a senha estiver correta
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                //res.json(req.session.user);
                res.redirect("/admin/articles")
            }else{
                res.redirect("/login");
            }

        }else{
            res.redirect("/login");// Se não redireciona
        }
    });


})

// Rota para fazer o logout
router.post("/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/");
});


module.exports = router;