const Guild = require("../../models/guild.js");
const User = require("./../../models/user");

module.exports = {
    name: "channel",
    description: "change the pokemon spawn channel",
    options: [
        {
            name: "channel",
            description: "pokemon channel",
            type: 7,
            required: true,
            channel_types: [0],
        },
    ],

    run: async (client, interaction) => {
        let user = await User.findOne({ id: interaction.user.id });
        if (!user) {
            return interaction.reply(
                `Please pick a starter pokemons using /start before using this command`
            );
        }

        let nguild =
            (await Guild.findOne({ id: interaction.guild.id })) ||
            (await Guild.create({ id: interaction.guild.id }));

        if (!nguild.spawnbtn)
            return interaction.reply(
                "You need to enable the spawn system first, type /spawn"
            );
        let channel = interaction.options.getChannel("channel");

        nguild.spawnchannel = channel.id;
        await nguild.save();

        interaction.reply({
            content: `The Pokemon spawn channel has been set to <#${nguild.spawnchannel}>`,
        });
    },
};
