const express=require('express');
const router=express.Router();
const Listing=require("../models/listing.js")
const wrapAsync=require("../utils/wrapasync.js")
const flash = require('connect-flash');
const { isLoggedIn,isOwner,validatelisting } = require('../middleware.js');
const listingControler=require('../Controllers/listingController.js')
const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage })
//Index Route -1
router.route('/')
.get(wrapAsync(listingControler.index))
.post(isLoggedIn,upload.single('listing[image]'),validatelisting,wrapAsync(listingControler.createListing))

router.get("/search",wrapAsync(listingControler.searchListing)) 

//TERMs Page
router.get('/terms',wrapAsync(listingControler.Listingterms))

//privacy
router.get('/privacy',wrapAsync(listingControler.privacyPolicy))


 //New Route-2a
 router.get("/new",isLoggedIn,listingControler.rendernewForm)

 router.route("/:id")
 .put(isLoggedIn,isOwner,upload.single('listing[image]'),validatelisting,wrapAsync(listingControler.updateListing))
 .delete(isLoggedIn,isOwner,wrapAsync(listingControler.deleteListing))
 .get(wrapAsync(listingControler.showListing))

 
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControler.renderEditForm));

 
 

 module.exports=router;