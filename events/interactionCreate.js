const { InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (error) {
                if (interaction.replied) {
                    await interaction
                        .editReply({
                            content: "Something went wrong",
                        })
                        .catch(() => {});
                } else {
                    await interaction
                        .reply({
                            content: "Something went wrong",
                            ephemeral: true,
                        })
                        .catch(() => {});
                }
                console.log(error);
            }
        }
    },
};
