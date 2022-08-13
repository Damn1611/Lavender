const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
} = require("discord.js");
const config = require("./config/config.json");
const colors = require("colors");

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

// Getting the bot token:
const AuthenticationToken = config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn(
    "[CRASH] Authentication Token for Discord bot is required!".red + "\n"
  );
  return process.exit();
}

// Handlers:
client.commands = new Collection();
client.slashcmds = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "slash", "events"].forEach((file) => {
  require(`./handlers/${file}`)(client);
});

// Login to the bot:
client.login(AuthenticationToken).catch((err) => {
  console.warn(
    "[CRASH] Something went wrong while connecting to your bot..." + "\n"
  );
  console.warn("[CRASH] Error from Discord API:" + err);
  process.exit();
});

// Handle errors:
process.on("unhandledRejection", async (err) => {
  console.log(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
});
