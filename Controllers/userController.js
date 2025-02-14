const passport = require('passport');
const User=require('../models/user.js');

module.exports.renderSigninForm=(req,res)=>{
    res.render('../users/signup.ejs')
}

module.exports.signIn=async(req,res)=>{
    // console.log(req.body);
    try{
        let {username,email,password}=req.body;
        let newuser = new User({email,username})
        let registeredUser=await User.register(newuser, password)
        console.log(registeredUser);
        //AUTOLOGIN
        req.login(registeredUser,(err)=>{
            if(err){
                next(err)
            }
            req.flash('Success',"Welcome To Waderlust")
            res.redirect('/listings') 
        })
     
    }catch(err){
        console.log(req.flash('failure'));
        req.flash('failure',err.message)
        res.redirect('/signup')
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('../users/login.ejs')
}

module.exports.loginUser=async (req,res)=>{
    req.flash('Success','Welcome to wanderlust! You are logged in')
    //REDIRECT
    let redirect=res.locals.redirectUrl || '/listings'
    res.redirect(redirect)
}

module.exports.logoutUSer=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash('Success','You Are Logged Out Successfully!')
        res.redirect('/listings')
    })
}