const express=require("express");
const app=express();
const PORT=process.env.PORT || 5000;
const bcrypt=require("bcrypt");
const bloggydbconnection=require("./config/dbConnection");
const userSchema=require("./models/user");
//initializing variables for logins , etc.
var isloggedin=false;
var emailid="";
const saltrounds=10;
 
const initializeobj={firstname:"",lastname:"",email:""}
app.set("view engine","ejs");

app.use(express.urlencoded({extended:false}));
app.listen((PORT), ()=>{
   bloggydbconnection();
    console.log(`listening on ${PORT}`);
})


app.get("/",(req,res)=>{
    if(isloggedin){
        res.render("index",{emailid:emailid,userdetails:initializeobj});
    }
    else{ 
        res.render("login",{error:false,message:""});
    }
});



app.get("/signup",(req,res)=>{
    res.render("signup",{error:false,message:""});
});


app.get("/signup",(req,res)=>{
    if(isloggedin){
        res.render("/");
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

const isexists=await userSchema.findOne({email:email});
if(isexists){
    emailid="";
    res.render("signup",{error:true,message:"Email already exists."})
}

const salt = await bcrypt.genSalt(saltrounds);
    const hashedpwd = await bcrypt.hash(password, salt);
    await userSchema.create([{
        firstname:firstname,
        lastname:lastname,
        mobile:mobile,
        email:email,
        password:hashedpwd,
    }])
    emailid=email;
    res.render("login",{error:false,message:"Signed up successfully, please login in again!"});
})

app.get("/login",(req,res)=>{
    res.render("login",{error:false,message:""});
})

app.post("/login",async(req,res)=>{

    const emailId=req.body.email;
    const password=req.body.password;
    //get password from db and compare with given password
    const userdetails=await userSchema.findOne({email:emailId});
    console.log(userdetails.password);
    const isauthorized= await bcrypt.compare(password,userdetails.password);
    console.log(isauthorized);
    if(isauthorized){
        isloggedin=true;
        emailid=emailId;
        res.render("index",{userdetails:userdetails,emailid:emailId});
    }else{
        emailid="";
        isloggedin=false;
        res.render("login",{error:true,message:"invalid credentials"});
    }

});

app.get("/logout",(req,res)=>{
    isloggedin=false;
    emailid="";
    res.redirect("/");
})