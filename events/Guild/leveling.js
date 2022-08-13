const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.json");
const Enmap = require("enmap");
const xpGain = new Set();
userdb = new Enmap({ name: "userdb" });

module.exports = {
  name: "leveling",
  description: "Keeping track of leveling and currency",
};

let onetothree = ["998432544620023898"];
let onetoone = [];

client.on("messageCreate", async (message) => {
  if (
    message.channel.type !== 0 ||
    message.author.bot ||
    message.content.startsWith(config.Prefix) ||
    !message.guild
  )
    return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const key = `${message.author.id}`;
  userdb.ensure(key, {
    id: key,
    xp: 0,
    xpTotal: 15,
    xpIncrementer: 20,
    level: 1,
    money: 0,
  });

  let userData = await userdb.get(key);
  let onexp = onetoone.includes(message.channel.id);
  let threexp = onetothree.includes(message.channel.id);

  if (onexp) {
    let xpToAdd = Math.floor(Math.random() * 1) + Number(1); // 1 xp
    let moneyToAdd = Math.floor(Math.random() * 8) + Number(3); // between 3 - 8 coins

    userData.money += Number(moneyToAdd);
    userData.xp += Number(xpToAdd);
    await userdb.set(key, userData);
    xpGain.add(message.author.id);
    setTimeout(() => {
      xpGain.delete(message.author.id);
    }, 8000);
  } else if (threexp) {
    let xpToAdd = Math.floor(Math.random() * 3) + Number(1); // between  1 - 3 xp
    let moneyToAdd = Math.floor(Math.random() * 8) + Number(3); // between 3 - 8 coins

    userData.money += Number(moneyToAdd);
    userData.xp += Number(xpToAdd);
    await userdb.set(key, userData);
    xpGain.add(message.author.id);
    setTimeout(() => {
      xpGain.delete(message.author.id);
    }, 500);
  } else return;

  if (userData.xp >= userData.xpTotal) {
    const lvlupembed = new EmbedBuilder()
      .setAuthor({ name: `${message.author.tag}` })
      .setColor("blue")
      .setDescription(`You leveled up to level **${userData.level + 1}**!`)
      .setFooter({ text: "Kyoto Dev", iconURL: client.user.displayAvatarURL() })
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    message.channel.send({ embeds: [lvlupembed] });
    console.log(
      `${message.author.id} - ${message.author.tag} leveled up to level ${
        userData.level + 1
      }`
    );
    userData.level += 1;
    userData.xpTotal += 20;

    let incrementerist = userdb.get(key, "xpIncrementer");
    userData.level = Number(userData.level) + 1;
    userData.xpTotal =
      40 * Math.pow(userData.level, 2) - 40 * userData.level + 35;
    incrementerist =
      40 * Math.pow(userData.level, 2) -
      40 * userData.level +
      35 -
      (40 * Math.pow(userData.level - 1, 2) - 40 * (userData.level - 1) + 35);
    await userdb.set(key, userData);
    await userdb.set(key, incrementerist, "xpIncrementer");
  }
});
