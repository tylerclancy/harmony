import * as fs from 'fs';
import * as path from 'path';

export const registerEvents = async (client) => {
  const eventsPath = path.join(process.cwd(), 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  const eventParams = {
    guildMemberAdd: 'member',
    guildCreate: 'guild',
  };

  for (const file of eventFiles) {
    const event = await import(`../events/${file}`);
    const eventName = file.split('.')[0];

    if (eventName in eventParams) {
      const paramName = eventParams[eventName];
      client.on(eventName, (...args) => event.default(client, ...args));
    } else {
      client.on(eventName, event.default.bind(null, client));
    }
  }
};
