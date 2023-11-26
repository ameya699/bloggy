const express=require("express");
const app=express();
const PORT=process.env.PORT || 5000;

app.set("view engine","ejs");

app.use(express.urlencoded({extended:false}));
app.listen((PORT), ()=>{
   
    console.log(`listening on ${PORT}`);
})


app.get("/",(req,res)=>{
    res.render("login");
});


app.get("/signup",(req,res)=>{
    res.render("signup");
});


app.get("/login",(req,res)=>{
    res.render("login");
});