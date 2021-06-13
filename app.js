
const express   = require("express"),
      app       = express(),
      mongoose  = require("mongoose");


app.set("view engine","ejs");

app.get("/", (req,res) => {
    res.render("home");
});

app.post

app.listen(1000, function(){
    console.log("Running on port 1000");
});