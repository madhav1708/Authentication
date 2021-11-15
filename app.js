//jshint esversion:6
require('dotenv').config();
//it is imp to keep dotenv on top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");
 const userSchema=new mongoose.Schema({
   email:String,
   password:String
 });
//Schema is created

//const secret="This is our secret";
// above line is now going to .env
//userSchema.plugin(encrypt, { secret: secret ,encryptedFields: ["password"]});
//now secret is in .env
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"]});

// we want only password tobe encrypted field
//it is imp that we write userSchema.plugin(encrypt, { secret: secret ,encryptedFields: ["password"]}); before const User=mongoose.model("User",userSchema);
 const User=mongoose.model("User",userSchema);
//model is created

app.get("/",function(req,res){
  res.render("Home");
})


app.get("/login",function(req,res){
  res.render("Login");
})

app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){//when we call save automatically mongoose will encypt our password
    if(!err){
      res.render("secrets");
    }
    else {
      console.log(err);
    }
  });
});


app.post("/login",function(req,res){

    const x=req.body.username;
    const y=req.body.password;
   User.findOne({email:x},function(err,foundUser){
     if(err){
       console.log(err);
     }
     else{
       if(foundUser){
         if(foundUser.password===y){//here mongoose will decypt password automatically
          console.log(foundUser.password);
           res.render("secrets");
         }
       }
     }
   })
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
