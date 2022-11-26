const {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits: gib,
} = require("discord.js");
const mongoose = require("mongoose");

// Client setup
class Bot extends Client {
    constructor() {
        super({
            failIfNotExists: true,
            allowedMentions: {
                everyone: false,
                roles: false,
                users: false,
            },
            intents: [
                gib.Guilds,
                gib.GuildMessages,
                gib.MessageContent,
                gib.GuildMembers,
            ],
            presence: {
                status: "online",
                activities: [
                    {
                        name: "Version " + require("../package.json").version,
                        type: ActivityType.Watching,
                    },
                ],
            },
        });

        // Global Variables
        this.slashCommands = new Collection();
        this.config = require("../config.js");
        if (!this.token) this.token = this.config.token;

        // Mongoose Connection
        mongoose.connect(this.config.mongourl, {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
            useUnifiedTopology: true,
        });
        mongoose.Promise = global.Promise;

        mongoose.connection.on("connected", () => {
            console.log("\u001b[34mMongoose is ready\u001b[0m");
        });

        mongoose.connection.on("err", (err) => {
            console.log(`Mongoose connection error: ${err.stack}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose disconnected");
        });

        ["slashCommand", "events"].forEach((handler) => {
            require(`../handler/${handler}`)(this);
        });
    }
    // Initialize client
    connect() {
        return super.login(this.token);
    }
}

module.exports = Bot;
