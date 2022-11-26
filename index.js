// Client declaration
const Bot = require("./structure/client");
const client = new Bot();

module.exports = client;

// Login through the client
client.connect();
