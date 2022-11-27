const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "start",
    description: "start your adventure",

    run: async (client, interaction) => {
        let embed = new EmbedBuilder()
            .setAuthor({
                name: "Professor Oak",
                iconURL:
                    "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg",
            })
            .setTitle("Hello " + interaction.user.username)
            .setDescription(
                `**Welcome to the world of Pokémon!**` +
                    `\nTo begin playing, choose one of these pokémon with the \`/pick <pokemon>\` command, like this: \`/pick bulbasaur\``
            )
            .addFields(
                {
                    name: "Generation I (Kanto)",
                    value: "Bulbasaur, Charmander, Squirtle",
                },
                {
                    name: "Generation II (Johto)",
                    value: "Chikorita, Cyndaquil, Totodile",
                },
                {
                    name: "Generation III (Hoenn)",
                    value: "Treecko, Torchic, Mudkip",
                },
                {
                    name: "Generation IV (Sinnoh)",
                    value: "Turtwig, Chimchar, Piplup",
                },
                {
                    name: "Generation V (Unova)",
                    value: "Snivy, Tepig, Oshawott",
                },
                {
                    name: "Generation VI (Kalos)",
                    value: "Chespin, Fennekin, Froakie",
                },
                {
                    name: "Generation VII (Alola)",
                    value: "Rowlet, Litten, Popplio",
                },
                {
                    name: "Generation VIII (Galar)",
                    value: "Grookey, Scorbunny, Sobble",
                }
            )
            .setImage(
                "https://media.discordapp.net/attachments/1028320754607075358/1046227803873484871/Fb2cwja.png"
            );

        return interaction.reply({ embeds: [embed] });
    },
};
