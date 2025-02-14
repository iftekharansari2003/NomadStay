const express=require('express');
const app=express();
const router=express.Router();
const User=require('../models/user.js');
const wrapasync = require('../utils/wrapasync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../Controllers/userController.js')

              //******** SIGN UP ********

router.route('/signup')
.get(userController.renderSigninForm)
.post(wrapasync(userController.signIn)) 


              //******** LOGIN ********

router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userController.loginUser)

            //******** LOGOUT ********

router.get('/logout',userController.logoutUSer)

module.exports=router;