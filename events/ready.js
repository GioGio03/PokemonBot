module.exports = {
    name: "ready",
    run: async (client) => {
        console.log(`\u001b[34m${client.user.tag} is ready\u001b[0m`);
    },
};
