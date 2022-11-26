// this event is kinda messed up so try to improve it
const Canvas = require("@napi-rs/canvas");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { get } = require("request-promise-native");
const fs = require("fs");
const Pokemon = require("./../Classes/Pokemon");
let scool = new Set();
let Guild = require("../models/guild.js");
let User = require("../models/user.js");
let levelUp = require("../db/levelup.js");
let Spawn = require("../models/spawn.js");
let shinyDb = require("../db/shiny");
let Gen8 = require("../db/gen8.js");
let color = 0x00ffff;

const common = fs
    .readFileSync("./db/common.txt")
    .toString()
    .trim()
    .split("\n")
    .map((r) => r.trim());
const alolan = fs
    .readFileSync("./db/alolans.txt")
    .toString()
    .trim()
    .split("\n")
    .map((r) => r.trim());
const mythic = fs
    .readFileSync("./db/mythics.txt")
    .toString()
    .trim()
    .split("\n")
    .map((r) => r.trim());
const legend = fs
    .readFileSync("./db/legends.txt")
    .toString()
    .trim()
    .split("\n")
    .map((r) => r.trim());
const ub = fs
    .readFileSync("./db/ub.txt")
    .toString()
    .trim()
    .split("\n")
    .map((r) => r.trim());
const galarian = fs
    .readFileSync("./db/galarians.txt")
    .toString()
    .trim()
    .split("\n")
    .map((r) => r.trim());

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot || !message.guild) return;

        let prefix = [`<@${client.user.id}>`, `<@!${client.user.id}>`];
        let guild = await Guild.findOne({ id: message.guild.id });

        if (!guild) await new Guild({ id: message.guild.id }).save();
        guild = await Guild.findOne({ id: message.guild.id });

        let user = await User.findOne({ id: message.author.id });

        if (
            guild.spawnbtn &&
            !message.content.toLowerCase().startsWith(prefix[0].toLowerCase())
        ) {
            if (!scool.has(message.channel.id))
                await spawnPokemon(message, client);
            if (user)
                await leveling(message, client).catch((err) => {
                    if (err.message.toLowerCase().startsWith(`VersionError`))
                        return;
                });
        }

        if (message.content.startsWith(prefix[0])) prefix = prefix[0];
        else if (message.content.startsWith(prefix[1])) prefix = prefix[1];
        else prefix = "/";
    },
};

async function spawnPokemon(message, client) {
    let guild = await Guild.findOne({ id: message.guild.id });
    let channel = client.channels.cache.get(message.channel.id);
    if (!guild) await new Guild({ id: message.guild.id }).save();
    guild = await Guild.findOne({ id: message.guild.id });

    if (!guild.spawnbtn) return;
    if (guild.disabledChannels.includes(message.channel.id)) return;
    if (guild.spawnchannel !== null)
        channel = client.channels.cache.get(guild.spawnchannel);
    if (!channel) return;

    let spawn = await Spawn.findOne({ id: channel.id });
    if (!spawn) await new Spawn({ id: channel.id }).save();
    spawn = await Spawn.findOne({ id: channel.id });

    // if (spawn.pokemon[0]) return;// console.log(spawn.pokemon[0].name);
    if (guild.spawnchannel && scool.has(message.channel.id)) return;
    if (!guild.spawnchannel && scool.has(message.channel.id)) return;

    var gen = pickRandom();
    var type = common;
    if (gen == "common") type = common;
    if (gen == "alolan") type = alolan;
    if (gen == "mythic") type = mythic;
    if (gen == "legend") type = legend;
    if (gen == "ub") type = ub;
    if (gen == "galarian") type = galarian;
    var shiny = false;
    //type = galarian
    gen = Math.floor(Math.random() * 100000) + 1;
    if (gen <= 10) shiny = true;
    const random = type[Math.floor(Math.random() * type.length)];
    var name = random.trim().split(/ +/g).join("-").toLowerCase();
    var findGen8 = Gen8.find((r) => r.name === name);
    var Name = name;
    if (name.startsWith("alolan-")) {
        name = name.replace("alolan-", "");
        Name = `${name}-alola`;
        name = random;
    }
    const options = {
        url: `https://pokeapi.co/api/v2/pokemon/${Name}`,
        json: true,
    };
    if (name.toLowerCase().startsWith("giratina"))
        options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
    if (name.toLowerCase().startsWith("deoxys"))
        options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
    if (name.toLowerCase().startsWith("shaymin"))
        options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
    //if (name.toLowerCase() === "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
    if (name.toLowerCase().startsWith("nidoran-m"))
        options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
    if (name.toLowerCase().startsWith("nidoran-f"))
        options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
    if (name.toLowerCase().startsWith("porygon z" || "porygon-z"))
        options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
    if (name.toLowerCase().startsWith("landorus"))
        options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
    if (name.toLowerCase().startsWith("thundurus"))
        options.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
    if (name.toLowerCase().startsWith("tornadus"))
        options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
    if (name.toLowerCase().startsWith("mr.mime"))
        options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
    if (name.toLowerCase().startsWith("pumpkaboo"))
        options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
    if (name.toLowerCase().startsWith("meowstic"))
        options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
    if (name.toLowerCase().startsWith("toxtricity"))
        options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
    if (name.toLowerCase().startsWith("mimikyu"))
        options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised  ";
    await get(options)
        .then(async (t) => {
            let check = t.id.toString().length;
            let url;

            if (!shiny) {
                if (check === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`;
                } else if (check === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`;
                } else if (check === 3 && !Name.endsWith("-alola")) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`;
                } else if (check > 3 && Name.endsWith("-alola")) {
                    let t2 = await get({
                        url: `https://pokeapi.co/api/v2/pokemon/${Name.replace(
                            "-alola",
                            ""
                        )}`,
                        json: true,
                    });

                    let check2 = t2.id.toString().length;
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t2.id}_f2.png`;

                    if (check2 === 1) {
                        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t2.id}_f2.png`;
                    } else if (check2 === 2) {
                        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t2.id}_f2.png`;
                    } else if (check2 === 3) {
                        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t2.id}_f2.png`;
                    }
                }
            } else {
                let get = shinyDb.find((r) => r.name === Name);
                if (get) url = get.url;
                if (!get)
                    url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${random.toLowerCase()}.gif`;
            }
            if (findGen8) uri = findGen8.url;

            var re;
            const Type = t.types
                .map((r) => {
                    if (r !== r) re = r;
                    if (re == r) return;
                    return `${capitalize(r.type.name)}`;
                })
                .join(" | ");
            let lvl = Math.floor(Math.random() * 50);
            let poke = new Pokemon(
                {
                    name: random,
                    id: t.id,
                    shiny: shiny,
                    rarity: Type,
                    url: url,
                },
                lvl
            );

            if (shiny == true && Name.endsWith("alola")) {
                if (
                    shinyDb.find(
                        (r) => r.name.toLowerCase() === Name.toLowerCase()
                    )
                )
                    url = shinyDb.find((r) => r.name === Name).url;
            }

            let x = 100,
                y = 100;
            let bg;
            let shadow = true;
            if (Type.toLowerCase().startsWith("bug"))
                (bg =
                    "https://cdn.discordapp.com/attachments/845169966864400424/845191611247886386/d4bkb17-8e7eda09-2b22-4953-b672-96012e314a62.png"),
                    (shadow = true);
            if (Type.toLowerCase().startsWith("water"))
                (bg =
                    "https://cdn.discordapp.com/attachments/849927302468599808/851826672185770034/IMG_20210608_194442.jpg"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("rock"))
                (bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/845875885865041930/mike-blank-JWa5jZ1LkJY-unsplash.jpg"),
                    (y = 120),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("flying"))
                (bg =
                    "https://cdn.discordapp.com/attachments/845193133100105756/845193150695079976/rffw88nr-1354076846.png"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("grass"))
                (bg =
                    "https://cdn.discordapp.com/attachments/845169966864400424/845191611247886386/d4bkb17-8e7eda09-2b22-4953-b672-96012e314a62.png"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("normal"))
                bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/845875885865041930/mike-blank-JWa5jZ1LkJY-unsplash.jpg";
            if (Type.toLowerCase().startsWith("steel"))
                bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/845875885865041930/mike-blank-JWa5jZ1LkJY-unsplash.jpg";
            if (Type.toLowerCase().startsWith("ice"))
                (bg =
                    "https://cdn.discordapp.com/attachments/849927302468599808/851826207649169418/IMG_20210608_194256.jpg"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("electric"))
                bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/846372312352948244/lightning.jpg";
            if (Type.toLowerCase().startsWith("ground"))
                (bg =
                    "https://cdn.discordapp.com/attachments/849927302468599808/851825385469116457/IMG_20210608_193934.jpg"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("fairy"))
                bg = "https://i.imgur.com/Rb6aOwO.jpg";
            if (Type.toLowerCase().startsWith("bug"))
                bg =
                    "https://cdn.discordapp.com/attachments/853888483919003648/853959317845573652/roman-wimmers-AG9K1yABNGg-unsplash_2.jpg";
            if (Type.toLowerCase().startsWith("ghost"))
                (bg =
                    "https://cdn.discordapp.com/attachments/849927302468599808/851827081800318986/IMG_20210608_194625.jpg"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("fire"))
                bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/845876368737828904/ed037afd6a9c1c8c93e4bf8048e34603fe02ed11r1-1024-671v2_hq.jpg";
            if (Type.toLowerCase().startsWith("psychic"))
                (bg =
                    "https://cdn.discordapp.com/attachments/849927302468599808/851829360117415936/IMG_20210608_195515.jpg"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("figthing"))
                (bg =
                    "https://cdn.discordapp.com/attachments/845192128208699452/845192151675174932/fight.png"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("dark"))
                (bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/845878462613815306/jr-korpa-tzQkuviIuHU-unsplash.jpg"),
                    (shadow = false);
            if (Type.toLowerCase().startsWith("dragon"))
                bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/845878295622713364/a043bc570949f5f039c3dec5dea65d39.jpg";
            if (Type.toLowerCase().startsWith("poison"))
                (bg =
                    "https://cdn.discordapp.com/attachments/844390398687707157/846368819588104242/dapo-oni-64tVc0A2_xQ-unsplash.jpg"),
                    (shadow = false);

            const canvas = Canvas.createCanvas(512, 512);
            const context = canvas.getContext("2d");
            const background = await Canvas.loadImage(bg);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            if (shadow) {
                let shad =
                    "https://cdn.discordapp.com/attachments/844789985424703569/844986800015540234/iuqEeA-shadow-png-pic-controlled-drugs-cabinets-from-pharmacy.png";
                const shadow = await Canvas.loadImage(shad);
                context.drawImage(shadow, x, y + 10, 400, 400);
            }

            const pk = await Canvas.loadImage(poke.url);
            context.drawImage(pk, x, y, 400, 400);

            let tx =
                "https://cdn.discordapp.com/attachments/844789985424703569/844984267109040138/day.png";
            const time = await Canvas.loadImage(tx);
            context.drawImage(time, 0, 0, canvas.width, canvas.height);
            // message.channel.send("Oh Ho You were Traveling And It Seems Like You have found a Pokemon")
            let embed = new EmbedBuilder()
                .setTitle("A Wild Pokémon appeared")
                .setDescription(
                    `Guess the pokémon and type <@760158417108598826>catch to catch it!`
                )
                .setImage("attachment://" + "new.png")
                .setColor(color);

            if (scool.has(message.channel.id)) return;
            await channel.send({
                embeds: [embed],
                files: [
                    new AttachmentBuilder(await canvas.encode("png"), {
                        name: "new.png",
                    }),
                ],
            });
            spawn.pokemon = [];
            spawn.pokemon.push(poke);
            scool.add(message.channel.id);
            spawn.time = Date.now() + 259200000;
            await spawn.save();
            setTimeout(async () => {
                scool.delete(message.channel.id);
            }, 60000);
        })
        .catch((err) => {
            if (err.message.includes(`404 - "Not Found"`)) return; // channel.send(`Unable to spawn this pokemon due to no availability of this pokemon.\nName: ${random}`);
            if (err.message.toLowerCase().startsWith(`VersionError`)) return;
            // if(err.message.startsWith(`No matching document found for id`)) return;
        });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function pickRandom() {
    if (Math.floor(Math.random() * 10000) + 1 <= 7) return "ub";
    if (Math.floor(Math.random() * 10000) + 1 <= 5) return "legends";
    if (Math.floor(Math.random() * 10000) + 1 <= 10) return "mythics";
    if (Math.floor(Math.random() * 10000) + 1 <= 100) return "galarian";
    if (Math.floor(Math.random() * 1000) + 1 <= 10) return "alolans";

    return "common";
}

async function leveling(message, client) {
    let user = await User.findOne({ id: message.author.id });
    if (!user) return;
    if (user.blacklist) return;

    let selected = user.selected;
    let poke = user.pokemons[selected];
    if (!poke) return;
    //if (xpCooldown.has(message.author.id)) return;
    const guild = await Guild.findOne({ id: message.guild.id });
    let prefix = guild.prefix;
    if (message.content.startsWith(`${prefix}`)) return;
    if (poke.level == 100) return;
    let curxp = poke.xp;
    if (poke.level < 20) {
        x = Math.floor(Math.random() * 10) + 20;
    }
    if (poke.level > 10 && poke.level < 50) {
        x = Math.floor(Math.random() * 200) + 50;
    }
    if (poke.level > 51) {
        x = Math.floor(Math.random() * 300) + 50;
    }

    let newXp = curxp + x;
    let lvl = poke.level;
    let embed9 = new EmbedBuilder()
        .setTitle(`Congratulations ${message.author.username}!`)
        .setDescription(
            `Your ${user.pokemons[selected].shiny ? "⭐" : ""} ${capitalize(
                user.pokemons[user.selected].name
            )} has Leveled up to ${poke.level + 1}.`
        )
        .setThumbnail(user.pokemons[selected].url)
        .setColor(color);

    var n = parseInt(poke.level);
    let neededXp = ((1.2 * n) ^ 3) - ((15 * n) ^ 2) + 100 * n - 140;
    if (user.blacklist) return;
    if (newXp > neededXp) {
        poke.level = lvl + 1;
        poke.xp = 0;
        user.pokemons[selected] = poke;
        user.markModified(`pokemons`);
        await user.save();

        for (var i = 0; i < levelUp.length; i++) {
            if (
                poke.name.toLowerCase() == levelUp[i].name.toLowerCase() &&
                poke.level > levelUp[i].levelup
            ) {
                msg = `Congratulations ${message.author}! Your \`${capitalize(
                    poke.name
                )}\` has just Leveled up to ${
                    poke.level + 1
                } and Evolved into ${capitalize(levelUp[i].evo)}`;
                poke.name = capitalize(levelUp[i].evo);
                poke.xp = newXp;
                user.pokemons[selected] = poke;
                user.markModified(`pokemons`);
                await user.save();
            }
        }
        //   setTimeout(() => xpCooldown.delete(message.author.id), 30000)
        return message.channel.send({ embeds: [embed9] });
    } else {
        poke.xp = newXp;
        user.pokemons[selected] = poke;
        user.markModified(`pokemons`);
        await user.save();
    }
}
