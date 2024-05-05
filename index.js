import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { registerCommands } from './utils/commandHandler.js';
import { registerEvents } from './utils/eventHandler.js';

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
client.commands = new Collection();

registerCommands(client);
registerEvents(client);

client.login(process.env.DISCORD_TOKEN);
