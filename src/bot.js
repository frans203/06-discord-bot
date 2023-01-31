require("dotenv").config();

const { Client, WebhookClient } = require("discord.js");
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in `);
});

client.on("message", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/i);
    const member = message.guild.members.cache.get(args[0]);

    if (CMD_NAME === "kick" && args.length === 0) {
      return message.reply("Please provide an ID");
    } else if (CMD_NAME === "kick" && member) {
      member
        .kick()
        .then((member) => message.channel.send(`${member} was kicked.`));
    } else if (CMD_NAME === "kick" && !member) {
      message.channel.send(`That member was not found`);
    } else if (
      CMD_NAME === "kick" &&
      !message.member.hasPermission("KICK_MEMBERS")
    ) {
      return message.reply("Don't have permissions");
    } else if (
      CMD_NAME === "ban" &&
      !message.member.hasPermission("BAN_MEMBERS")
    ) {
      return message.reply("You do not have permissions to use that command");
    } else if (CMD_NAME === "ban" && args.length === 0) {
      return message.reply("Please provide an ID");
    } else if (
      CMD_NAME === "ban" &&
      message.member.hasPermission("BAN_MEMBERS")
    ) {
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("User was banned successfully");
      } catch (err) {
        console.log(err);
        message.channel.send(
          "An error occured. Either i do not have permissions or the user was not found"
        );
      }
    } else if (CMD_NAME === "announce") {
      const msg = args.join(" ");
      webhookClient.send(msg);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);

  if (member) {
    switch (name) {
      case "🍎":
        member.roles.add("1070087227503292616");
        break;
      case "🍌":
        member.roles.add("1070090161607692380");
        break;
      case "🪕":
        member.roles.add("1070090258588389386");
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);

  if (member) {
    switch (name) {
      case "🍎":
        member.roles.remove("1070087227503292616");
        break;
      case "🍌":
        member.roles.remove("1070090161607692380");
        break;
      case "🪕":
        member.roles.remove("1070090258588389386");
        break;
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
