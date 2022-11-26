require("dotenv").config(); // remove this line if you are using replit

module.exports = {
    token: process.env.TOKEN || "", // your bot token
    mongourl: process.env.MONGO_URI || "", // mongoose connection string
    clientID: process.env.CLIENT_ID || "", // your bot client id
};

// you can choose to fill these parameters in this file or in the env file
