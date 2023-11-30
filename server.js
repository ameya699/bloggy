const express=require("express");
const app=express();
const PORT=process.env.PORT || 5000;
const bcrypt=require("bcrypt");
const bloggydbconnection=require("./config/dbConnection");
const userSchema=require("./models/user");
const blogSchema=require("./models/blog");
const session=require("express-session");
const cookieParser = require("cookie-parser");
var createTextVersion = require("textversionjs");

const cookiesecret="bloggycookiesecret";
const saltrounds=10;

 

app.set("view engine","ejs");
app.use(cookieParser());
app.use(session({
    secret:cookiesecret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,maxAge:3600000
    }
}))


app.use(express.urlencoded({extended:false}));
app.listen((PORT), ()=>{
   bloggydbconnection();
    console.log(`listening on ${PORT}`);
})


app.get("/",async(req,res)=>{
    if(req.session.user){
        const blogscollection=await blogSchema.find();
        const currentUser=await userSchema.findOne({email:req.session.user.email})
        res.render("index",{emailid:req.session.user.email,blogscollection:blogscollection,currentUser});
    }
    else{ 
        res.render("login",{error:false,message:""});
    }
});



app.get("/signup",(req,res)=>{
    res.render("signup",{error:false,message:""});
});


app.get("/signup",(req,res)=>{
    if(req.session.user){
        res.redirect("/");
    }
    else{
        res.render("/signup");
    }
})

app.post("/signup",async(req,res)=>{
    //insert email and password in database;
    const password=req.body.password.trim();
    const email=req.body.email.trim();
    const firstname=req.body.firstname.trim();
    const lastname=req.body.lastname.trim();
    const mobile=req.body.mobile.trim() || "NA";
    if((password && email && firstname && lastname)==undefined) {
        res.render("login",{error:true,message:"Empty Credentials are not allowed"});
    }
const isexists=await userSchema.findOne({email:email});
if(isexists){
    res.render("signup",{error:true,message:"Email already exists."})
}

const salt = await bcrypt.genSalt(saltrounds);
    const hashedpwd = await bcrypt.hash(password, salt);
   try{
    const iscreated= await userSchema.create([{
        firstname:firstname,
        lastname:lastname,
        mobile:mobile,
        email:email,
        password:hashedpwd,
    }])
    if(!iscreated){
        res.render("login",{error:true,message:"Empty Credentials are not allowed"});
    }
   }
   catch{
    res.render("login",{error:true,message:"Empty Credentials are not allowed"});
   }
    
    res.render("login",{error:false,message:"Signed up successfully, please login in again!"});
})

app.get("/login",(req,res)=>{
    if(req.session.user){
        res.redirect("/index");
    }
    res.render("login",{error:false,message:"",emailid:null});
})

app.post("/login",async(req,res)=>{

    const emailId=req.body.email;
    const password=req.body.password;
    //get password from db and compare with given password
    const userdetails=await userSchema.findOne({email:emailId});
    if(userdetails){
        const isauthorized= await bcrypt.compare(password,userdetails.password);
        console.log(isauthorized);
        if(isauthorized){
            req.session.user={email:userdetails.email};
            res.redirect("/");
        }else{
            res.render("login",{error:true,message:"invalid credentials"});
        }
    }
    else{
        res.render("login",{error:true,message:"user doesn't exists"})
    }
    

});

app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
})

app.get("/readblog/:id",async(req,res)=>{
    if(req.session.user){
        const blog=await blogSchema.findOne({_id:req.params.id});
        if(blog){

            res.render("blog",{blog:blog,loggeduser:req.session.user})
        }
        else{
            res.redirect("/");
        }
    }
    else{
        res.redirect("/")
    }
})

app.get("/createblog",(req,res)=>{
    if(req.session.user){
        res.render("createblog");
    }
    else{
        res.redirect("/");
    }
    
    
})

app.post("/createblog",async(req,res)=>{
    if(req.session.user){
        const heading=req.body.heading;
        const content=req.body.content;
        const plaincontent=createTextVersion(content).trim().substring(0,50);
        const createdbyName=await userSchema.findOne({email:req.session.user.email});
        const result=  await blogSchema.create({
            heading:heading,
            content:content,
            createdby:createdbyName.firstname+" "+createdbyName.lastname,
            email:req.session.user.email,
            plaincontent:plaincontent
        })
        if(result){
            res.redirect("/");
        }
    }
    else{
        res.redirect("/")
    }
})

app.get("/editblog/:id",async(req,res)=>{
    if(req.session.user){
        const blogdata=await blogSchema.findOne({_id:req.params.id});
        
        res.render("editblog",{blog:blogdata,loggeduser:req.session.user})
    }
})

app.post("/editblog/:id",async(req,res)=>{
    if(req.session.user){
        const plaincontent=createTextVersion(req.body.content).trim().substring(0,10);
        const isupdated=await blogSchema.updateOne({_id:req.params.id},{
            heading:req.body.heading,
            content:req.body.content,
            plaincontent:plaincontent,
            modifiedtime:new Date()
        })
        if(isupdated){
            res.redirect(`/readblog/${req.params.id}`)
        }
        else{
            res.redirect("/error");
        }
    }
})

app.get("/deleteblog/:id",async(req,res)=>{
    if(req.session.user){
        const iscurrentuser=await userSchema.findOne({email:req.session.user.email});
        if(iscurrentuser){
            const isdeleted=await blogSchema.findByIdAndDelete(req.params.id);
            console.log(req.params);
            if(isdeleted){
                res.redirect("/");
            }
            else{
                res.redirect("/error");
            }
        }
        else{
            res.redirect("/error");
        }
        
    }
    else{
        
        res.redirect("/")
    }
})

app.get("*",(req,res)=>{
    res.render("errorpage");
})
  
