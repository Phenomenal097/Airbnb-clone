const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


main().then((res) => {
    console.log("The db connection is established");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//index route
app.get("/listings", async(req,res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
})

//New route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Create route
app.post("/listings", async(req,res) => {
    let {title, description, image, price, location, country} = req.body;
    const data = new listing({
        title: title,
        description: description, 
        image: image,
        price: price,
        location: location,
        country: country
    });
    await data.save();
    res.redirect("/listings");
})

//show route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("listings/show.ejs",{listingData});
})

//Edit route
app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("listings/edit.ejs", {listingData});
})

//Update route
app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listingData});
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.get("/", (req,res) => {
    console.log("root url is set");
});

app.listen("8080", () => {
    console.log("Listening at port 8080");
})