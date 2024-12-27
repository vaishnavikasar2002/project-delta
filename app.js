const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; //going to the website and take a url

main()
    .then(()=> {
    console.log("connected to DB");
    })
    .catch(err=>{
    console.log(err);
    });


async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded ({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res)=>{
    res.send("hi, I am root");
});

//topic: Index route 
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , { allListings});
 });


// topic: New Route
 app.get("/listings/new",(req,res)=> {
    res.render("listings/new.ejs");
 });

//Topic : Show Route
app.get("/listings/:id", async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}); 

//topic: Create Route 
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Topic : Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id.trim());
    res.render("listings/edit.ejs",{listing});
});

//topic : Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing });
    res.redirect(`/listings/${id}`);
  });
  
// topic: Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });


// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing ({
//          title:"My New Villa",
//          description:"By the beach",
//          price:1200,
//          location:"Calangute, Goa",
//          country:"India",

//     });

//     try{
//     await sampleListing.save();
//     console.log("sample was saved:",sampleListing);
//     res.send("successful testing");

//     } catch (error) {
//         console.log("Error saving listing:",error);
//         res.status(500).send("Failed to save listing");
//     }

// });

app.listen(8080, ()  => {
    console.log("server is listening to port 8080");
});

