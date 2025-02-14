const Review=require("../models/review.js")
const Listing=require("../models/listing.js")


module.exports.createReview=async(req,res)=>{
    let {id}=req.params
    console.log(id);
    let listing=await Listing.findById(id)

    let curreview=new Review(req.body.review);
    curreview.author=req.user._id;
    console.log(curreview);
    listing.reviews.push(curreview)

    await curreview.save();
   let review= await listing.save();
   req.flash('Success','Review Added Succesfully!')
    
    res.redirect(`/listings/${id}`)

}


module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('Success','Review Deleted Succesfully!')
    res.redirect(`/listings/${id}`)
}
