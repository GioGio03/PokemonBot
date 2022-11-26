const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 100 },
    level: { type: Number, default: 1 },
    selected: { type: Number, default: 0 },
    pokemons: { type: Array, default: [] },
    redeems: { type: Number, default: 0 },
    badges: { type: Array, default: [] },
    orderAlphabet: { type: Boolean, default: false },
    orderIV: { type: Boolean, default: false },
    orderLevel: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    shards: { type: Number, default: 0 },
    redeems: { type: Number, default: 0 },
    shinyCaught: { type: Number, default: 0 },
    caught: { type: Array, default: [] },
    released: { type: Number, default: 0 },
    blacklist: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now() },
    lbcaught: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
