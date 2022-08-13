const { EmbedBuilder } = require("discord.js");
const nekoclient = require("nekos.life");
const { QuickDB } = require("quick.db");
const neko = new nekoclient();

const randomcd = [18000, 24000, 30000];
const random = Math.floor(Math.random() * randomcd.length);
let randomCooldown = randomcd[random];

module.exports = {
  config: {
    name: "slap",
    description: "slap someone",
  },
  permissions: ["SendMessages"],
  owner: false,

  run: async (client, message, args, mention) => {
    const { QuickDB } = require("quick.db");
    const db = new QuickDB();
    const ms = require("parse-ms-2");

    function getUserFromMention(mention) {
      if (!mention) return;
      if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);
        if (mention.startsWith("!")) {
          mention.slice(1);
        }
        return client.users.cache.get(mention);
      }
    }

    const user = getUserFromMention(args[0]);

    let lastSlap = await db.get(`lastAction_${message.author.id}`);
    let lastCooldown = await db.get(`lastCooldown_${message.author.id}`);

    let mentionEmbed = new EmbedBuilder()
      .setDescription(`${message.author}, Please mention a user!`)
      .setColor("Red");
    if (!user)
      return message.channel.send({ embeds: [mentionEmbed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });

    if (lastSlap !== null && lastCooldown - (Date.now() - lastSlap) > 0) {
      let timeObj = ms(lastCooldown - (Date.now() - lastSlap));

      let cdEmbed = new EmbedBuilder().setDescription(
        `${message.author}, You can Slap again in **${timeObj.minutes}m** and **${timeObj.seconds}s**`
      );
      return message.channel.send({ embeds: [cdEmbed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
    } else {
      let SlapEmbed = new EmbedBuilder()
        .setImage((await neko.slap()).url)
        .setDescription(`${message.author} Slapged ${user}`)
        .setColor("Purple");
      message.channel.send({ embeds: [SlapEmbed] });
      db.set(`lastAction_${message.author.id}`, Date.now());
      db.set(`lastCooldown_${message.author.id}`, randomCooldown);
    }
  },
};
