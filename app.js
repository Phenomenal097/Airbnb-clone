const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

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



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error.message);
    }
    else{
        next();
    }
}
//index route
app.get("/listings",validateListing, wrapAsync(async(req,res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Create route
app.post("/listings",validateListing, wrapAsync(async(req,res) => {
    let result = listingSchema.validate(req.body);
    console.log(result.error);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
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
}))

//show route
app.get("/listings/:id",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("listings/show.ejs",{listingData});
}))

//Edit route
app.get("/listings/:id/edit",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("listings/edit.ejs", {listingData});
}))

//Update route
app.put("/listings/:id",validateListing, wrapAsync(async (req,res) => {
    if(!req.body.listingData){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listingData});
    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.get("/", (req,res) => {
    res.send("Home directory");
})

//If none of the endpoints are hit then this will hit {middleware}
app.use((req, res, next)=> {
    next(new ExpressError(404, "Page not found!"));
});

//Create an error handling middleware
app.use((err, req, res, next)=> {
    let {status=500, message="Something went wrong"} = err;
    res.status(status).render("error.ejs", {err});
});

app.listen("8080", () => {
    console.log("Listening at port 8080");
})