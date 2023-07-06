//Route middleware
function admMiddleware(req,res,next){
    if(!req.session.userLogged){
        return res.redirect('/users/login')
    }else{
        if(req.session.userLogged.id_user_categories !=1){
            return res.redirect('/users/profile')
        }
    }

    return next()
}
module.exports=admMiddleware