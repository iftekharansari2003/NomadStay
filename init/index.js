const mongoose=require('mongoose');
let initdata=require("./data.js")
const Listing=require("../models/listing.js")

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main().then(()=>{
    console.log("Connected To DB");
})
.catch((err)=>{
    console.log(err);
})

const initdb=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"67961607c84d5de537514bd6",}))
    await Listing.insertMany(initdata.data);
    console.log("Data Was Initialised");
}
initdb();
