const { PermissionsBitField, Routes } = require("discord.js");
const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest");

const data = [];
let count = 0;

// Loads all available commands
module.exports = (client) => {
    readdirSync("./slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./slashCommands/${dir}/`).filter(
            (files) => files.endsWith(".js")
        );

        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`);
            client.slashCommands.set(slashCommand.name, slashCommand);

            data.push({
                name: slashCommand.name,
                description: slashCommand.description,
                type: slashCommand.type,
                options: slashCommand.options ? slashCommand.options : null,
                default_member_permissions:
                    slashCommand.default_member_permissions
                        ? PermissionsBitField.resolve(
                              slashCommand.default_member_permissions
                          ).toString()
                        : null,
            });
            count++;
        }
    });
    console.log(`\u001b[32mSlash Commands loaded: ${count}\u001b[0m`);

    const rest = new REST({ version: "10" }).setToken(
        client ? client.config.token : process.env.TOKEN
    );
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(
                    client ? client.config.clientID : process.env.CLIENT_ID
                ),
                { body: data }
            );
        } catch (error) {
            console.log(error);
        }
    })();
};
