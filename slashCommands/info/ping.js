module.exports = {
    name: "ping",
    description: "return websocket ping",

    run: async (client, interaction) => {
        interaction.reply({ content: `${client.ws.ping} ms` });
    },
};
