const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js")
const ExpressError=require("../utils/ExpressError.js")
const {validatereview,isLoggedIn,isreviewAuthor}=require('../middleware.js')
const reviewController=require('../Controllers/reviewController.js')

//REVIEW- POST ROUTE
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.createReview))

//REVIEW - DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.destroyReview))


module.exports=router