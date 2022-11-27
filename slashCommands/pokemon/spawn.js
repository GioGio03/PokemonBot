const Guild = require("../../models/guild.js");
const User = require("./../../models/user");

module.exports = {
    name: "spawn",
    description: "spawn config",
    options: [
        {
            name: "action",
            description: "action to perform",
            type: 3,
            required: true,
            choices: [
                {
                    name: "enable",
                    value: "enable",
                },
                {
                    name: "disable",
                    value: "disable",
                },
            ],
        },
    ],

    run: async (client, interaction) => {
        let action = interaction.options.getString("action");
        let user = await User.findOne({ id: interaction.user.id });
        if (!user) {
            return interaction.reply(
                `Please pick a starter pokemons using /start before using this command`
            );
        }

        let nguild =
            (await Guild.findOne({ id: interaction.guild.id })) ||
            (await Guild.create({ id: interaction.guild.id }));

        nguild.spawnbtn = action.toLowerCase() === "enable" ? true : false;
        await nguild.save();

        interaction.reply(
            `Pokemon Spawn has been set to \`${nguild.spawnbtn}\``
        );
    },
};
