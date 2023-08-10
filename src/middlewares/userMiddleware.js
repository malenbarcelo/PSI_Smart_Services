//Route middleware
function userMiddleware(req,res,next){
    console.log(req.session.userLogged)
    console.log(req.params.company)
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