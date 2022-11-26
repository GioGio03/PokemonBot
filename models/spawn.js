const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
    id: { type: String, required: true },
    pokemon: { type: Array, default: [] },
    hcool: { type: Boolean, default: false },
    time: { type: Number, default: 0 },
    scool: { type: Boolean, default: false },
});

module.exports = mongoose.model("Spawn", GuildSchema);
