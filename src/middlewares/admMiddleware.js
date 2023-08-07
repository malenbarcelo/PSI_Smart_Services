//Route middleware
function admMiddleware(req,res,next){
    if(!req.session.userLogged){
        return res.redirect('/')
    }else{
        console.log('hola')
        if(req.session.userLogged.id_user_categories != 1){
            return res.redirect('/courses/my-courses')
        }
    }

    return next()
}
module.exports=admMiddleware