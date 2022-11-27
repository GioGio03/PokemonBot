const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { capitalize, getlength } = require("../../functions/pkfunctions");
const { get } = require("request-promise-native");
const User = require("../../models/user.js");
const Gen8 = require("../../db/gen8.js");
const Shiny = require("../../db/shiny.js");
const Forms = require("../../db/forms.js");
const Concept = require("../../db/concept.js");
const Galarians = require("../../db/galarians.js");
const Mega = require("../../db/mega.js");
const ShinyMega = require("../../db/mega-shiny.js");
const Shadow = require("../../db/shadow.js");
const Primal = require("../../db/primal.js");
const Pokemon = require("../../db/pokemon.js");
const Gmax = require("../../db/gmax.js");

module.exports = {
    name: "info",
    description: "info on your pokemon",
    options: [
        {
            name: "pokemon",
            description: "pokemon you want to view",
            type: 3,
        },
    ],

    run: async (client, interaction) => {
        const pk = interaction.options.getString("pokemon");
        let user = await User.findOne({ id: interaction.user.id });

        if (!user || !user.pokemons[0])
            return interaction.reply("You need to pick a starter pokémon");

        let a = user,
            s = a.pokemons.map((r, i) => {
                r.num = i + 1;
                return r;
            });

        var selected = user.selected || 0;

        if (pk && !isNaN(pk)) {
            selected = parseInt(pk) - 1;

            if (!user.pokemons[selected])
                return interaction.reply(
                    "You don't have a pokémon with this number"
                );
        } else if (
            pk &&
            (pk.toLowerCase() === "latest" || pk.toLowerCase() === "l")
        ) {
            selected = user.pokemons.length - 1;
        }

        let name = user.pokemons[selected].name.toLowerCase();

        let shiny = Shiny.find((e) => e.name === name);

        if (name.startsWith("alolan")) {
            name = name.replace("alolan", "").trim().toLowerCase();

            name = `${name}-alola`.toLowerCase();
        }

        let level = user.pokemons[selected].level,
            hp = user.pokemons[selected].hp,
            atk = user.pokemons[selected].atk,
            def = user.pokemons[selected].def,
            spatk = user.pokemons[selected].spatk,
            spdef = user.pokemons[selected].spdef,
            speed = user.pokemons[selected].speed;

        const gen8 = Gen8.find(
            (e) =>
                e.name.toLowerCase() ===
                user.pokemons[selected].name.toLowerCase()
        );

        const form = Forms.find(
            (e) =>
                e.name.toLowerCase() ===
                user.pokemons[selected].name.toLowerCase()
        );

        const concept = Concept.find(
            (e) =>
                e.name.toLowerCase() ===
                user.pokemons[selected].name.toLowerCase()
        );

        const galarian = Galarians.find(
            (e) =>
                e.name.toLowerCase() ===
                user.pokemons[selected].name
                    .toLowerCase()
                    .replace("galarian-", "")
        );

        const forms = Forms.find((e) => e.name === name.toLowerCase());

        const mega = Mega.find(
            (e) =>
                e.name.toLowerCase() === name.replace("mega-", "").toLowerCase()
        );

        const shadow = Shadow.find(
            (e) =>
                e.name.toLowerCase() ===
                name.replace("shadow-", "").toLowerCase()
        );

        const primal = Primal.find(
            (e) => e.name === name.replace("primal-", "").toLowerCase()
        );

        const pokemon = Pokemon.find(
            (e) => e.name === user.pokemons[selected].name.toLowerCase()
        );

        const gmax = Gmax.find(
            (e) =>
                e.name.toLowerCase() ===
                name.replace("gigantamax-", "").toLowerCase()
        );

        let desc;

        level !== 100
            ? (desc =
                  `${
                      user.pokemons[selected].nick != null
                          ? `**Nickname:** ${user.pokemons[selected].nick}\n`
                          : ""
                  }` +
                  `${user.pokemons[selected].xp}/${
                      ((1.2 * level) ^ 3) -
                      ((15 * level) ^ 2) +
                      100 * level -
                      140
                  }XP\n`)
            : (desc =
                  `${
                      user.pokemons[selected].nick != null
                          ? `**Nickname:** ${user.pokemons[selected].nick}\n`
                          : ""
                  }` + `**Max Level**\n`);

        let embed = new EmbedBuilder()
            .setTitle(
                `Level ${level} ${capitalize(
                    user.pokemons[selected].name.replace(/-+/g, " ")
                )}${user.pokemons[selected].shiny ? " ⭐" : ""}`
            )
            .setDescription(desc)
            .setThumbnail(interaction.user.displayAvatarURL());

        if (gen8) {
            let hpBase = gen8.hp,
                atkBase = gen8.atk,
                defBase = gen8.def,
                spatkBase = gen8.spatk,
                spdefBase = gen8.spdef,
                speedBase = gen8.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(gen8.type);

            var url = gen8.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);
                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (form) {
            let hpBase = form.hp,
                atkBase = form.atk,
                defBase = form.def,
                spatkBase = form.spatk,
                spdefBase = form.spdef,
                speedBase = form.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(form.type);

            var url = form.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);

                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (concept) {
            let hpBase = concept.hp,
                atkBase = concept.atk,
                defBase = concept.def,
                spatkBase = concept.spatk,
                spdefBase = concept.spdef,
                speedBase = concept.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();
            var type = capitalize(concept.type);
            var url = concept.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);

                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (
            galarian &&
            user.pokemons[selected].name.toLowerCase().startsWith("galarian")
        ) {
            let hpBase = galarian.hp,
                atkBase = galarian.atk,
                defBase = galarian.def,
                spatkBase = galarian.spatk,
                spdefBase = galarian.spdef,
                speedBase = galarian.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();
            var type = capitalize(galarian.type);
            var url = galarian.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);
                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (forms) {
            let hpBase = forms.hp,
                atkBase = forms.atk,
                defBase = forms.def,
                spatkBase = forms.spatk,
                spdefBase = forms.spdef,
                speedBase = forms.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();
            var type = capitalize(forms.type);
            var url = forms.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);
                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (mega && name.toLowerCase().startsWith("mega-")) {
            let hpBase = mega.hp,
                atkBase = mega.atk,
                defBase = mega.def,
                spatkBase = mega.spatk,
                spdefBase = mega.spdef,
                speedBase = mega.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(mega.type);

            var url = mega.url;

            shiny = ShinyMega.find(
                (e) => e.name === name.replace("mega-", "").toLowerCase()
            );

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);

                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (shadow && name.toLowerCase().startsWith("shadow")) {
            let hpBase = shadow.hp,
                atkBase = shadow.atk,
                defBase = shadow.def,
                spatkBase = shadow.spatk,
                spdefBase = shadow.spdef,
                speedBase = shadow.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(shadow.type);

            var url = shadow.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                await user.markModified(`pokemons`);

                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (primal && name.toLowerCase().startsWith("primal")) {
            let hpBase = primal.hp,
                atkBase = primal.atk,
                defBase = primal.def,
                spatkBase = primal.spatk,
                spdefBase = primal.spdef,
                speedBase = primal.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(primal.type);

            var url = primal.url;

            if (user.pokemons[selected].shiny && shiny) {
                if (
                    user.pokemons[selected].name.toLowerCase() ==
                    "primal-kyogre"
                ) {
                    url = "https://i.imgur.com/XdZwD0s.png";
                } else if (
                    user.pokemons[selected].name.toLowerCase() ==
                    "primal-groudon"
                ) {
                    url = "https://i.imgur.com/Xzm1FDn.png";
                }
            }

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);

                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (gmax && name.toLowerCase().startsWith("gigantamax")) {
            let hpBase = gmax.hp,
                atkBase = gmax.atk,
                defBase = gmax.def,
                spatkBase = gmax.spatk,
                spdefBase = gmax.spdef,
                speedBase = gmax.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(gmax.type);

            var url = gmax.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                user.markModified(`pokemons`);
                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        if (pokemon) {
            let hpBase = pokemon.hp,
                atkBase = pokemon.atk,
                defBase = pokemon.def,
                spatkBase = pokemon.spatk,
                spdefBase = pokemon.spdef,
                speedBase = pokemon.speed;

            let hpTotal = Math.floor(
                    Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                        level +
                        10
                ),
                atkTotal = Math.floor(
                    Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) *
                        0.9
                ),
                defTotal = Math.floor(
                    Math.floor(
                        ((2 * defBase + def + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                spatkTotal = Math.floor(
                    Math.floor(
                        ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                    ) * 1.1
                ),
                spdefTotal = Math.floor(
                    Math.floor(
                        ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                speedTotal = Math.floor(
                    Math.floor(
                        ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                    ) * 1
                ),
                ivTotal = (
                    ((hp + atk + def + spatk + spdef + speed) / 186) *
                    100
                ).toFixed(2);

            name = user.pokemons[selected].name.toLowerCase();

            var type = capitalize(pokemon.type);

            var url = pokemon.url;

            if (user.pokemons[selected].shiny && shiny) url = shiny.url;

            if (
                (user.pokemons[selected].shiny &&
                    user.pokemons[selected].name.toLowerCase() ==
                        "eternatus") ||
                url == "https://imgur.com/TUtkb2v.png"
            ) {
                url = "https://i.imgur.com/lkx7zZ3.png";
            } else if (
                user.pokemons[selected].shiny &&
                user.pokemons[selected].name.toLowerCase() == "meltan"
            ) {
                url = "https://i.imgur.com/le2MSsx.png";
            }

            if (url !== user.pokemons[selected].url) {
                user.pokemons[selected].url = url;

                await user.markModified(`pokemons`);

                await user.save();
            }

            desc =
                desc +
                `**Types:** ${type}\n` +
                `**Nature:** ${user.pokemons[selected].nature}\n` +
                `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
                `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
                `**Defense:** ${defTotal} - IV: ${def}/31\n` +
                `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
                `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
                `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
                `**Total IV %:** ${ivTotal}%\n`;

            embed
                .setDescription(desc)
                .setImage("attachment://" + "Pokemon.png")
                .setFooter({
                    text: `Displaying Pokémon: ${selected + 1}/${
                        user.pokemons.length
                    }\nTotal Pokémons: ${s.length}`,
                });

            return interaction.reply({
                embeds: [embed],
                files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
            });
        }

        let t = await get({
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            json: true,
        }).catch((err) => {
            interaction.reply("An error occured");
        });

        let hpBase = t.stats[0].base_stat,
            atkBase = t.stats[1].base_stat,
            defBase = t.stats[2].base_stat,
            spatkBase = t.stats[3].base_stat,
            spdefBase = t.stats[4].base_stat,
            speedBase = t.stats[5].base_stat;

        let hpTotal = Math.floor(
                Math.floor((2 * hpBase + hp + (0 / 4) * level) / 100) +
                    level +
                    10
            ),
            atkTotal = Math.floor(
                Math.floor(((2 * atkBase + atk + 0) * level) / 100 + 5) * 0.9
            ),
            defTotal = Math.floor(
                Math.floor(((2 * defBase + def + 0 / 4) * level) / 100 + 5) * 1
            ),
            spatkTotal = Math.floor(
                Math.floor(
                    ((2 * spatkBase + spatk + 0 / 4) * level) / 100 + 5
                ) * 1.1
            ),
            spdefTotal = Math.floor(
                Math.floor(
                    ((2 * spdefBase + spdef + 0 / 4) * level) / 100 + 5
                ) * 1
            ),
            speedTotal = Math.floor(
                Math.floor(
                    ((2 * speedBase + speed + 0 / 4) * level) / 100 + 5
                ) * 1
            ),
            ivTotal = (
                ((hp + atk + def + spatk + spdef + speed) / 186) *
                100
            ).toFixed(2);

        name = user.pokemons[selected].name.toLowerCase();

        var re;

        var type = t.types
            .map((r) => {
                if (r !== r) re = r;

                if (re == r) return;

                return `${capitalize(r.type.name)}`;
            })
            .join(" | ");

        var id;

        if (user.pokemons[selected].shiny && shiny) url = shiny.url;

        if (url !== user.pokemons[selected].url) {
            user.pokemons[selected].url = url;

            user.markModified(`pokemons`);

            await user.save();
        }

        desc =
            desc +
            `**Type:** ${type}\n` +
            `**Nature:** ${user.pokemons[selected].nature}\n` +
            `**HP:** ${hpTotal} - IV: ${hp}/31\n` +
            `**Attack:** ${atkTotal} - IV: ${atk}/31\n` +
            `**Defense:** ${defTotal} - IV: ${def}/31\n` +
            `**Sp. Atk:** ${spatkTotal} - IV: ${spatk}/31\n` +
            `**Sp. Def:** ${spdefTotal} - IV: ${spdef}/31\n` +
            `**Speed:** ${speedTotal} - IV: ${speed}/31\n` +
            `**Total IV%:** ${ivTotal}%\n`;

        if (getlength(t.id) === 1) id = `00${t.id}`;
        else if (getlength(t.id) === 2) id = `0${t.id}`;
        else if (getlength(t.id) === 3) id = t.id;

        if (name.startsWith("alolan")) {
            name = name.replace("alolan", "").trim().toLowerCase();

            const t2 = await get({
                url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                json: true,
            }).catch((err) => {
                message.reply("An error occured");
            });

            id = `${t2.id}_f2`;

            const ch = getlength(t2.id);

            if (ch === 1) {
                id = `00${t2.id}_f2`;
            } else if (ch === 2) {
                id = `0${t2.id}_f2`;
            } else if (ch === 3) {
                id = `${t2.id}_f2`;
            }
        }

        var url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;

        if (name.toLowerCase() == "shellos")
            url = "https://imgur.com/0TNMAHQ.png";

        if (name.toLowerCase() == "jellicent")
            url = "https://imgur.com/tMspIRX.png";

        if (
            user.pokemons[selected].name.toLowerCase() === "giratina-origin" &&
            !user.pokemons[selected].shiny
        )
            url = "https://imgur.com/UHVxS2q.png";

        if (
            user.pokemons[selected].name.toLowerCase() === "eternatus" &&
            user.pokemons[selected].shiny
        )
            url = "https://i.imgur.com/lkx7zZ3.png";

        if (user.pokemons[selected].shiny) {
            url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`;

            const pkmn = Shiny.find(
                (e) =>
                    e.name.toLowerCase().replace("-", " ") ===
                    name.toLowerCase().replace("-", " ")
            );

            if (pkmn) url = pkmn.url;

            if (name.toLowerCase() == "giratina-origin")
                url = `https://imgur.com/UHVxS2q.png`;

            if (name.toLowerCase() == "giratina-altered")
                url = `https://i.imgur.com/oSe49i5.png`;

            if (name.toLowerCase() === "primal-kyogre")
                url = "https://i.imgur.com/XdZwD0s.png";

            if (name.toLowerCase() === "primal-groudon")
                url = "https://i.imgur.com/Xzm1FDn.png";
        }

        if (url !== user.pokemons[selected].url) {
            user.pokemons[selected].url = url;

            user.markModified(`pokemons`);

            await user.save();
        }

        let imgname = "Pokemon.png";

        if (url.endsWith(".gif")) imgname = "Pokemon.gif";

        name = user.pokemons[selected].name.toLowerCase();

        embed
            .setDescription(desc)
            .setImage("attachment://" + imgname)
            .setFooter({
                text: `Displaying Pokémon: ${selected + 1}/${
                    user.pokemons.length
                } \nTotal Pokémons: ${s.length}`,
            })
            .setColor(0xe72a08);

        return interaction.reply({
            embeds: [embed],
            files: [new AttachmentBuilder(url, { name: "Pokemon.png" })],
        });
    },
};
