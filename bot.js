const clientLoader = require('./src/clientLoader');
const commandLoader = require('./src/commandLoader');
require('colors');

const COMMAND_PREFIX = '!';

clientLoader.createClient(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'])
  .then(async (client) => {
    await commandLoader.load(client);

    client.on('guildMemberAdd', async (member) => {
      const guild = member.guild;
      const role = await guild.roles.fetch('940638422584938606');
      await member.roles.add(role);
      // OU
      await member.roles.add('940638422584938606');
      // Le role à assigner doit etre placé en dessous du role du bot dans la liste des roles du serveur
    })

    client.on('messageCreate', async (message) => {
      // Ne pas tenir compte des messages envoyés par les bots, ou qui ne commencent pas par le préfix
      if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)) return;

      // On découpe le message pour récupérer tous les mots
      const words = message.content.split(' ');

      const commandName = words[0].slice(1); // Le premier mot du message, auquel on retire le préfix
      const arguments = words.slice(1); // Tous les mots suivants sauf le premier

      if (client.commands.has(commandName)) {
        // La commande existe, on la lance
        client.commands.get(commandName).run(client, message, arguments);
      } else {
        // La commande n'existe pas, on prévient l'utilisateur
        await message.delete();
        await message.channel.send(`The ${commandName} does not exist.`);
      }
    })
  });
