let Listing=require("./models/listing")
const ExpressError=require("./utils/ExpressError.js")
const {serverlistingSchema}=require("./ServerSchemasValidator.js")
const {serverreviewSchema}=require("./ServerSchemasValidator.js")
const Review=require("./models/review.js")


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash('error',"You Must Be Logged In To Create Listing")
        return res.redirect('/login')
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
}
next()
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
     if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash('error',"You Don't have Permission To Access It!")
        return res.redirect(`/listings/${id}`)
     }
     next()
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=serverlistingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=serverreviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.isreviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review =await Review.findById(reviewId);
     if(!review.author.equals(res.locals.curruser._id)){
        req.flash('error',"You Are Not Author Of this Review")
        return res.redirect(`/listings/${id}`)
     }
     next()

}