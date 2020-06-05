import * as path from 'path';

import * as Twitch from 'tmi.js'

interface Options {
  accessToken: string;
  refreshToken: string;
  channel: string;
  botUsername: string;
  oath: string;
}

(async () => {
  const config: Options = require(path.join(__dirname, '../config.json')); 

  const clientOptions: Twitch.Options = {
    options: {
      clientId: 'opycr1y6h3srsoz3smnkd8ixkqg7lp',
      debug: true
    },
    identity: {
      username: config.botUsername,
      password: config.oath
    }
  }

  const client = Twitch.Client(clientOptions);

  await client.connect()
  await client.join(config.channel)

  try {
    await client.action(config.channel, 'Joined Channel')
    await client.say(config.channel, "Bot services, how can I help you.")
  } catch (e) {
    console.log(e)
    
    await client.disconnect()
    process.exit(1)
  }

  await client.action(config.channel, 'Left Channel');
  process.exit(0);
})()
