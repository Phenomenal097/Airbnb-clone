const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error.message);
    }
    else{
        next();
    }
}

//Post review route
router.post("/", validateReview, wrapAsync(async(req,res) => {
    let findListing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    findListing.reviews.push(newReview._id);
    await findListing.save();
    await newReview.save();
    res.redirect(`/listings/${findListing._id}`);
}));

//Delete review route
router.delete("/:reviewId", wrapAsync(async(req,res) => {
    let {id, reviewId} = req.params;
    reviewId = reviewId.trim(); // ✅ fix accidental spaces
    await listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;