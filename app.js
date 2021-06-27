
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
mongoose.connect(process.env.DB_URL,
{
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


app.use(express.static(__dirname + "/public"));

//root
app.get("/", (req,res) =>
{
    //ejs parameters
    m="";
    url ="";
    n="";
    vis=true;

    //rendering the page
    res.render("home",{message:m, url:url,vision:vis,url_link:n,link:"LINK"});
});


//url checking
app.get("/:id", (req,res) =>
{
    Url.find({_id:req.params.id}, (err,docs) =>
    {
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

//new url for shortening
app.post("/url",async (req,res) => 
{
    const url = req.body.URL;//original url retrieved from the body of the request

    Url.find({orig_url:url}, async (err,docs) => 
    {
        if(docs.length)
        {
            //ejs parameters
            vis=false;
            n=process.env.HOME_URL+docs[0]._id;
            console.log(n);

            //rendering the page
            res.render("home",{url:url,message:message.existing_url,url_link:url,vision:vis,link:n});
        }
        else
        {
            //checking if the url is valid or not
            axios.get(url)
            .then( async (response) =>
            {
                console.log("valid url");
                
                //generating a unique id
                var check=true;
                var nid=nanoid(5);
                while(check)
                {
                    var u = new Url({orig_url:url,_id:nid});
                    await u.save().then(results => check=false); //checking if the id already exusts in the database or not
                    nid=nanoid(5); //if it exists we generate a new id again 
                }   
                
                //ejs parameters
                vis=false;
                n=process.env.HOME_URL+nid;
                
                //rendering the page
                res.render("home",{url:url,message:message.new_url,url_link:url,vision:vis,link:n}); 
            })
            .catch(function(error) //if the url is not valid
            {
                //ejs parameters
                vis=true;
                n="";

                //rendering the page
                res.render("home",{url:url,message:message.wrong_url,url_link:n,vision:vis,link:"LINK"});
            });
        }
    });    
});


app.listen(1000, function()
{
    console.log("Running on port 1000");
});