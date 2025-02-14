const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { ref } = require('joi');

const listingScema=new Schema({
    title : {
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image :{
        url:String,
        filename:String
    },
    price :{
        type:Number
    },
    location :{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

})

//Mongoose POST /PRE MIDDLEWARE FOR DELETE

listingScema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=new mongoose.model("Listing",listingScema)
module.exports=Listing;