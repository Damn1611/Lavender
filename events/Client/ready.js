const client = require("../../index");
const colors = require("colors");
const Enmap = require('enmap');

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log("\n" + `[READY] ${client.user.tag} is up and ready to go.`.brightGreen);
})