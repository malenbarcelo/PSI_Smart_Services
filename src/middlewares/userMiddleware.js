//Route middleware
function userMiddleware(req,res,next){
    if(!req.session.userLogged){
        return res.redirect('/')
    }else{
        if(req.session.userLogged.company != req.params.company){
            return res.redirect('/courses/my-courses/' + req.session.userLogged.company)
        }
    }

    return next()
}
module.exports=userMiddleware