const Listing=require("../models/listing.js")

module.exports.index=async(req,res)=>{
    let Lists= await Listing.find();
 //    console.log(Lists);
    res.render("index.ejs",{Lists})
 }

 module.exports.rendernewForm=(req,res)=>{
    res.render("new.ejs")
}

module.exports.createListing=async(req,res,next)=>{
     let url=req.file.path;
     let filename=req.file.filename
     const newlist=new Listing(req.body.listing)
        newlist.owner=req.user._id;
        newlist.image={url,filename}
         await newlist.save()
         req.flash('Success','New List is Added Succesfully!')
         res.redirect('/listings')
 }

 module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id)
    if(!list){
       req.flash('failure','Hotel Does not exist!')
       return res.redirect('/listings')
   }
   let orignalUrl=list.image.url;
   let newImageUrl=orignalUrl.replace('/upload','/upload/w_250')
    res.render("edit.ejs",{list,newImageUrl})
}

module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;
    if(!req.body.listing){
        next(new ExpressError(404,"Send Valid data for listing"))
    }
    let updatedlisting=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=='undefined'){
        let url=req.file.path;
        let filename=req.file.filename
        updatedlisting.image={url,filename};
        await updatedlisting.save();
    }
    
    req.flash('Success','List Edited Succesfully!')
    res.redirect(`/listings/${id}`)

}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('Success','List Deleted Succesfully!')
    res.redirect('/listings')

}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const List= await Listing.findById(id).populate({path:'reviews',
       populate:{
           path:'author'
       }
    }).populate('owner');
   if(!List){
       req.flash('failure','Hotel Does Not Exists!')
       return res.redirect('/listings')
   }
   res.render("show.ejs",{List})
}

//search
module.exports.searchListing=async(req,res)=>{
    let {Searched}=req.query;
    const Lists= await Listing.find({$or: [{title:Searched},{location:Searched},{country:Searched}]})
   if(Lists.length==0){
       req.flash('failure','No Hotel At Your Location')
       return res.redirect('/listings')
   }
   res.render("searchedList.ejs",{Lists})
}

module.exports.Listingterms=async(req,res)=>{
   res.render("terms.ejs")
}

module.exports.privacyPolicy=async(req,res)=>{
    res.render("privacy.ejs")
 }