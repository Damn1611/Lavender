const { green } = require("colors");
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder} = require("discord.js");

module.exports = {
  config: {
  name: "help",
  description: "Get the Command List"
},
  run: async (client, message, args) => {
    if (args[0]) {
      let command = args[0];
      let cmd = client.commands.get(command);

      if (!cmd) {
        return message.channel.send("Couldn't find that command!")
      } else if (cmd) {
        let description = cmd.config.description ? cmd.config.description : "No description available.";
        let userPerms = cmd.permissions ? cmd.permissions.join(", ") : "No permissions required.";
        let ownerOnly = cmd.owner ? "Yes" : "No";

        let helpEmbed = new EmbedBuilder()
        .setTitle(`Help for **${cmd.config.name}**`)
        .addFields([
          { name: "Name", value: `${cmd.config.name}`},
          { name: "Description", value: `${description}`},
          { name: "Owner Only", value: `${ownerOnly}`},
          { name: "Required User Permissions", value: `${userPerms}`}
        ])
        .setThumbnail(client.user.displayAvatarURL())

        return message.channel.send({ embeds: [helpEmbed] })
      }

    } else if (!args[0]) {

    let helpMenu = new ActionRowBuilder()
    .addComponents(
      new SelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder('Help Menu')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions([
        {
          label: "Roleplay",
          description: "Shows all the roleplay commands",
          value: "roleplay",
          emoji: "🎲"
        },
        {
          label: "Information",
          description: "Shows all the information commands",
          value: "info",
          emoji: "📢"
        },
        {
          label: "Moderation",
          description: "Shows all the moderation commands",
          value: "moderation",
          emoji: "🔒"
        }
      ])
    )

    let editEmbed = new EmbedBuilder()
    .setTitle('Help Menu')
    .setDescription('Choose an option from the menu below!')
    .setColor("Red")
    .setThumbnail(client.user.displayAvatarURL())

      message.channel.send({ embeds: [editEmbed], components: [helpMenu]}).then(msg=>{
        setTimeout(async function () {
          await msg.delete();
        }, 45000)
      })
    }
  }
};