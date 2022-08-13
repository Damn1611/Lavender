const { EmbedBuilder } = require("discord.js");
const nekoclient = require("nekos.life");
const { QuickDB } = require("quick.db");
const neko = new nekoclient();

const randomcd = [18000, 24000, 30000];
const random = Math.floor(Math.random() * randomcd.length);
let randomCooldown = randomcd[random];

module.exports = {
  config: {
    name: "kiss",
    description: "Kiss someone",
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

    let lastKiss = await db.get(`lastAction_${message.author.id}`);
    let lastCooldown = await db.get(`lastCooldown_${message.author.id}`);

    let mentionEmbed = new EmbedBuilder()
      .setDescription(`${message.author}, Please mention a user!`)
      .setColor("Red");
    if (!user)
      return message.channel.send({ embeds: [mentionEmbed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });

    if (lastKiss !== null && lastCooldown - (Date.now() - lastKiss) > 0) {
      let timeObj = ms(lastCooldown - (Date.now() - lastKiss));

      let cdEmbed = new EmbedBuilder().setDescription(
        `${message.author}, You can Kiss again in **${timeObj.minutes}m** and **${timeObj.seconds}s**`
      );
      return message.channel.send({ embeds: [cdEmbed] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
    } else {
      let KissEmbed = new EmbedBuilder()
        .setImage((await neko.kiss()).url)
        .setDescription(`${message.author} Kissed ${user}`)
        .setColor("Purple");
      message.channel.send({ embeds: [KissEmbed] });
      db.set(`lastAction_${message.author.id}`, Date.now());
      db.set(`lastCooldown_${message.author.id}`, randomCooldown);
    }
  },
};
