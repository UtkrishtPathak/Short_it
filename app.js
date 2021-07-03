
//importing the required libraries
require("dotenv").config();
const express       = require("express"),
      app           = express(),
      mongoose      = require("mongoose"),
      Url           = require ("./schema/url.js"),
      axios         = require("axios"),
      cron          = require("node-cron"),
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
    //ejs parameters for home page
    var m = "";
    var url = "";
    var n = "";
    var vis = true;
    
    //rendering the page
    res.render("home",{message:m,url:url,vision:vis,url_link:n,link:"LINK"});
});

//url checking
app.get("/:id",async (req,res) =>
{   
    Url.find({_id:req.params.id},function(err,docs)
    {
        console.log(docs);
        if(docs.length)
        {
            var original = "https://"+docs[0].orig_url;
            res.redirect(original)
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
    var url = req.body.URL;//original url retrieved from the body of the request
    
    //formatting the url
    var check = url.substr(0,5);
    var dom;
    if(check=="http:")
        dom=url.substr(7);
    else if(check=="https")
        dom=url.substr(8);
    
    if(check!="http:"&&check!="https")
       {
        dom = url; 
        url = "https://" + url;
       } 
    console.log(url);
    console.log(dom);

    //checking if a short version for the url exists in the database
    Url.find({orig_url:dom}, async (err,docs) => 
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
                var i=nanoid(5);
                var nid=i;
                while(check)
                {
                    i=nid;
                    var u = new Url({orig_url:dom,_id:i});
                    await u.save().then(results => check=false); //saving and checking if the id already exists in the database or not
                    nid=nanoid(5); //if it exists a new id is generated again 
                }   
                
                //ejs parameters
                vis=false;
                n=process.env.HOME_URL+i;
                
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

//Keeping the bot alive
cron.schedule("0 */3 * * * *", () => {
    axios.get("https://shtf.me/")
    .then(function(response){
        console.log("Keeping the bot alive");
    })
    .catch(function(error){
        console.log(error);
    })
})

//starting the app
const port = process.env.PORT||1000;
app.listen(port, function()
{
    console.log("Running on port "+port);
});