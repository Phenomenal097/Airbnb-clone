const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initdata = require("./data.js");

main().then((res) => {
    console.log("The db connection is established");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async() => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("Data inserted");
};

initDB();