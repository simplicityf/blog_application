const mongoose = require("mongoose");

const {connectionUrl} = require("../config/keys");

//Connecting mongob
const connectMongodb = async () => {
    try {
        await mongoose.connect(connectionUrl, {
            serverSelectionTimeoutMS: 30000  // Increase to 30 seconds
     });
        console.log("Mongodb connected successfully");
    } catch(error) {
        console.log(error.message)
    }
}

module.exports = connectMongodb;