const { get } = require("request-promise-native");
const { randomNumber } = require("../../functions/pkfunctions");
const User = require("../../models/user");
const gen8 = require("../../db/gen8.js");

const Pokemon = require("../../Classes/Pokemon");
const { EmbedBuilder } = require("discord.js");
let starters = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "chikorita",
    "cyndaquil",
    "totodile",
    "treecko",
    "torchic",
    "mudkip",
    "turtwig",
    "chimchar",
    "piplup",
    "snivy",
    "tepig",
    "oshawott",
    "chespin",
    "fennekin",
    "froakie",
    "rowlet",
    "litten",
    "popplio",
    "grookey",
    "scorbunny",
    "sobble",
];
let gen8Starters = ["grookey", "scorbunny", "sobble"];

module.exports = {
    name: "pick",
    description: "pick your starter",
    options: [
        {
            name: "pokemon",
            description: "your starter pokemon",
            type: 3,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const pk = interaction.options.getString("pokemon");

        let user = await User.findOne({ id: interaction.user.id });
        let name = pk.split(" ").join("-").toLowerCase();
        if (user)
            return interaction.reply({
                content: `You've already picked your **starter**`,
            });

        if (gen8Starters.includes(name)) {
            let find = gen8.find((r) => r.name === name);
            let url, shiny;
            if (randomNumber(0, 100) < 1) {
                shiny = true;
                url = find.url;
            } else if (randomNumber(0, 100) > 1) {
                shiny = false;
                url = find.url;
            }
            const type = find.type;
            let poke = new Pokemon({
                name: find.name,
                shiny: shiny,
                rarity: type,
                url: url,
            });

            await new User({ id: interaction.user.id }).save();
            user = await User.findOne({ id: interaction.user.id });
            user.selected = null;
            user.pokemons.push(poke);
            user.markModified(`pokemons`);
            user.save();

            let embed = new EmbedBuilder()
                .setAuthor({
                    name: "Professor Oak",
                    iconURL:
                        "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg",
                })
                .setTitle(
                    `${user.pokemons[0].name
                        .replace(/-+/g, " ")
                        .replace(/\b\w/g, (l) =>
                            l.toUpperCase()
                        )}! A fine choice, it has joined your team.`
                )
                .setDescription(
                    "Name " +
                        user.pokemons[0].name
                            .replace(/-+/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) +
                        "\nType " +
                        user.pokemons[0].rarity
                            .replace(/-+/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) +
                        "\nLevel " +
                        user.pokemons[0].level +
                        "\nIV " +
                        user.pokemons[0].totalIV +
                        "%IV"
                )
                .addFields(
                    { name: "Weight", value: "6 Kg" },
                    { name: "Height", value: "0.6m" }
                )
                .setThumbnail(user.pokemons[0].url);
            return interaction.reply({ embeds: [embed] });
        } else if (starters.includes(name)) {
            const t = await get({
                url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                json: true,
            });
            let url, shiny, re;
            let check = t.id.toString().length;

            if (randomNumber(0, 100) < 1) shiny = true;
            if (randomNumber(0, 100) > 1) shiny = false;
            if (!shiny) {
                if (check === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`;
                } else if (check === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`;
                } else if (check === 3) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`;
                }
            } else {
                let get = shinyDb.find((r) => r.name === name);
                if (get) url = get.url;
                if (!get)
                    url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name}.gif`;
            }

            const type = t.types
                .map((r) => {
                    if (r !== r) re = r;
                    if (re == r) return;
                    return `${r.type.name}`;
                })
                .join(" | ");
            let poke = new Pokemon({
                name: t.name,
                shiny: shiny,
                rarity: type,
                url: url,
            });

            await new User({ id: interaction.user.id }).save();
            user = await User.findOne({ id: interaction.user.id });
            user.pokemons.push(poke);
            user.markModified(`pokemons`);
            await user.save();

            let embed = new EmbedBuilder()
                .setAuthor({
                    name: "Professor Oak",
                    iconURL:
                        "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg",
                })
                .setTitle(
                    `${user.pokemons[0].name
                        .replace(/-+/g, " ")
                        .replace(/\b\w/g, (l) =>
                            l.toUpperCase()
                        )}! A fine choice, it has joined your team.`
                )
                .setDescription(
                    "Name " +
                        user.pokemons[0].name
                            .replace(/-+/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) +
                        "\nType " +
                        user.pokemons[0].rarity
                            .replace(/-+/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) +
                        "\nLevel " +
                        user.pokemons[0].level +
                        "\nIV " +
                        user.pokemons[0].totalIV +
                        "%IV"
                )
                .addFields(
                    { name: "Weight", value: `${t.weight / 10} Kg` },
                    { name: "Height", value: `${t.height / 10}m` }
                )
                .setThumbnail(user.pokemons[0].url);
            return interaction.reply({ embeds: [embed] });
        } else {
            return interaction.reply({
                content: `\`${name}\` doesn't exist`,
            });
        }
    },
};
