const mongoose=require("mongoose");


const blogSchema=new mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:false
    },
    plaincontent:{
        type:String,
    },
    publishtime:{
        type:Date,
        default:new Date()
    },
    createdby:{
        type:String
    },
    email:{
        type:String
    },
    modifiedtime:{
        type:Date,
    }
})



module.exports=mongoose.model("blog",blogSchema)