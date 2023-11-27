const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:false
    },
    lastname:{
        type:String,
        required:false,
    },
    mobile:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:false,
    }, 
    password:{
        type:String,
        required:false,
    }
})



module.exports=mongoose.model("user",userSchema)