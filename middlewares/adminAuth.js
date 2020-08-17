function adminAuth(req, res, next){
    // Se estiver logado siga
    if(req.session.user != undefined){
        next();
    }else{
        // Se não volte para página inicial
        res.redirect("/login");
    }
}

module.exports = adminAuth