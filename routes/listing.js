const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");

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
router.get("/", wrapAsync(async(req,res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New route
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Create route
router.post("/",validateListing, wrapAsync(async(req,res) => {
    const data = new listing({ ...req.body.listingData });
    await data.save();
    res.redirect("/listings");
}))

//show route
router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listingData});
}))

//Edit route
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listingData = await listing.findById(id);
    res.render("listings/edit.ejs", {listingData});
}))

//Update route
router.put("/:id",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listingData});
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;