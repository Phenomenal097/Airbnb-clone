const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

//Routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    next();
})


//For common route
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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