const { readdirSync } = require("fs");
let count = 0;

// Loads all available events
module.exports = (client) => {
    readdirSync("./events/").forEach((file) => {
        const event = require(`../events/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
        count++;
    });
    console.log(`\u001b[32mEvents loaded: ${count}\u001b[0m`);
};
