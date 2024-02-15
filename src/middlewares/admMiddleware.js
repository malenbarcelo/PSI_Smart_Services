//Route middleware
function admMiddleware(req,res,next){
    if(!req.session.userLogged){
        return res.redirect('/')
    }else{
        if(req.session.userLogged.id_user_categories != 1){
            return res.redirect('/courses/my-courses/' + req.session.userLogged.company)
        }
    }

    return next()
}
module.exports=admMiddleware