
const express       = require("express"),
      app           = express(),
      mongoose      = require("mongoose"),
      Url           = require ("./schema/url.js"),
      axios         = require("axios");


//database connection
mongoose.connect("mongodb://localhost:27017/Shortify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db=mongoose.connection;
db.on("error",console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});
  
app.use(express.urlencoded({extended: true}));

app.set("view engine","ejs");

app.get("/", (req,res) =>
{
    message = "";
    url ="";
    res.render("home",{message:message, url:url});
});

app.post("/url",(req,res) => 
{
    const url = req.body.URL;
    console.log(req.body.URL);
    axios.get(url)
    .then(function(response)
    {
        console.log("valid url");
    })
    .catch(function(error)
    {
        res.render("home",{url:url,message:"NOT A VALID URL"});
    })
});


app.listen(1000, function(){
    console.log("Running on port 1000");
});