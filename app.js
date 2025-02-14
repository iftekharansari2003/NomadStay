if(process.env.NODE_ENV!='production'){
    require('dotenv').config()
}

const express=require('express');
const mongoose=require('mongoose');
const path=require("path");
const methodoverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError.js")
const app=express();
const session =require("express-session")
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local')
const User=require('./models/user.js')

const listings=require('./routes/listingRoutes.js')
const reviews=require('./routes/reviewRoute.js')
const users=require('./routes/userRoutes.js')
const {isLoggedIn}=require('./middleware.js')

const dburl=process.env.ATLAS_DB_URL

async function main() {
   await mongoose.connect(dburl)
}

main().then(()=>{
    console.log("Connected To DB");
})
.catch((err)=>{
    console.log(err);
})


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views/listings"))
app.use(express.static(path.join('public')))
app.engine("ejs",ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET_CODE
    },
    touchAfter: 24 * 3600,
})
store.on('error',()=>{
    console.log('Error in MONGO SESSION STORE',err);
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET_CODE,
    saveUninitialized:true,
    resave:false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnlu:true
    }
};
// app.get("/",(req,res)=>{
//     res.send("Hii I Am Root")
// })


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.Success=req.flash('Success')
    res.locals.failure=req.flash('failure')
    res.locals.error=req.flash('error')
    res.locals.curruser=req.user;
    next()
})

// app.get('/demouser',async(req,res)=>{
//     let fakeuser=new User({
//         email:'student@gmail.com',
//         username:'delta-student2'
//     });
//     let registeredUser=await User.register(fakeuser,'Helloworld');
//     res.send(registeredUser)
// })

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)
app.use('/',users)


//Error Handler For All Random/Incorrect Path/Routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404 ,"Page Not Found!!"))
})


app.use((err,req,res,next)=>{
    let {statusCode=500,message='Some Error Occured'}=err
    res.status(statusCode).render("error.ejs",{err})
})

app.listen(8080,()=>{
    console.log("Server Listening to port 8080");
})

