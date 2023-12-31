const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
        default:"NA"
    },
    email:{
        type:String,
        required:true,
    }, 
    password:{
        type:String,
        required:true,
    }
})



module.exports=mongoose.model("user",userSchema)