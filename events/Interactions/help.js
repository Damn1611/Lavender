const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  name: "interactionCreate",
};

client.on("interactionCreate", async (interaction, message) => {
  if (!interaction.isSelectMenu()) return;
  //if (interaction.author !== message.author) return;
  if (interaction.customId === "help_menu") {
    let msg = await interaction.channel.messages.fetch(interaction.message.id);

    if (interaction.values[0] === "roleplay") {
      await interaction.deferUpdate();

      const roleplayEmbed = new EmbedBuilder()
        .setTitle("Roleplay Commands")
        .setDescription("`hug`, `kiss`, `pat`, `slap`")
        .setColor("Red")
        .setThumbnail(client.user.displayAvatarURL());

      await msg.edit({ embeds: [roleplayEmbed] });
    } else if (interaction.values[0] === "info") {
      await interaction.deferUpdate();

      const infoEmbed = new EmbedBuilder()
        .setTitle("Info Commands")
        .setDescription("`4`, `5`, `6`")
        .setColor("Red")
        .setThumbnail(client.user.displayAvatarURL());

      await msg.edit({ embeds: [infoEmbed] });
    } else if (interaction.values[0] === "moderation") {
      await interaction.deferUpdate();

      const modEmbed = new EmbedBuilder()
        .setTitle("Moderation Commands")
        .setDescription("`7`, `8`, `9`")
        .setColor("Red")
        .setThumbnail(client.user.displayAvatarURL());

      await msg.edit({ embeds: [modEmbed] });
    }
  }
});
