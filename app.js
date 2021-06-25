
//importing the required libraries
require("dotenv").config();
const express       = require("express"),
      app           = express(),
      mongoose      = require("mongoose"),
      Url           = require ("./schema/url.js"),
      axios         = require("axios"),
      message       = require("./message.js");
var { nanoid }      = require("nanoid");



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


//enabling the app to access the body of the requests sent
app.use(express.urlencoded({extended: true}));

//setting the app to check for ejs files in the views folder
app.set("view engine","ejs");


app.get("/", (req,res) =>
{
    m="";
    url ="";
    n=process.env.HOME_URL;
    vis=true;
    res.render("home",{message:m, url:url,vision:vis,url_link:n,link:"LINK"});
});

app.get("/:id", (req,res) =>
{
     short_url=process.env.HOME_URL+req.params.id;
     console.log(short_url);
     Url.find({new_uid:short_url}, (err,docs) => {
        if(docs.length)
        {
            var original = docs[0].orig_url;
            res.redirect(original);
        }
        else
        {
            res.sendStatus(404);
        }
     });     
});

app.post("/url",async (req,res) => 
{
    const url = req.body.URL;
    console.log(req.body.URL);
    axios.get(url)
    .then(function(response)
    {
        console.log("valid url");
        Url.find({orig_url:url}, async (err,docs) => {
            if(docs.length)
            {
                console.log(docs);
                vis=false;
                n=docs[0].new_uid;
                console.log(n);
                res.render("home",{url:url,message:message.existing_url,url_link:url,vision:vis,link:n});
            }
            else
            {
                var id=process.env.HOME_URL+nanoid(8);
                var u = new Url({orig_url:url,new_uid:id});
                
                await u.save();

                Url.find({orig_url:url},function(err,docs){
                    console.log(docs);
                    vis=false;
                    n=docs[0].new_uid;
                    res.render("home",{url:url,message:message.new_url,url_link:url,vision:vis,link:n}); 
                });
            }
        })
    })
    .catch(function(error)
    {
        vis=true;
        n=process.env.HOME_URL;
        res.render("home",{url:url,message:message.wrong_url,url_link:n,vision:vis,link:"LINK"});
    })
});


app.listen(1000, function(){
    console.log("Running on port 1000");
});