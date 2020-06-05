const readline = require('readline');
const process = require('process');

const TwitchBot = require('twitch-bot');

// Config options
const config = require('./config.json');
 
// Bot object
const Bot = new TwitchBot({
	username : config.username,
	oauth    : config.oauth,
	channel  : config.channel
});

// Keep track of the deaths
let deathCounter = 0;

console.log('Connecting bot with the following options');
console.log('username: ', config.username);
console.log('   oauth: ', config.oauth);
console.log(' channel: ', config.channel);

// Join the channel callback
Bot.on('join', () => {
	console.log('Bot Connected');
	Bot.say('It still works')
	
	// Process every message that comes in
	Bot.on('message', chatter => {
		console.info(chatter.display_name, ': ', chatter.message);
		parseCommand(chatter.message, chatter.display_name);
	});
});

// Error handling
Bot.on('error', err => {
	console.log('Connection error!');
	console.log(err)
});

Bot.on('close', () => {
	console.log('closing the bot');
});

/**
 * This function will parse a message and check for possible commands that may have been entered. If the message is a command, route the
 * request to a proper handler for said command.
 * 
 * @param {string} messageText The message text currently being processed
 */
function parseCommand(messageText, username){
	// Twitch can have lots of messages per second on popular channels,
	// so we should filter out a majority of the non command messages with an inexpensive check below.
	if(messageText[0] === '!'){
		// Split the command into words that can be easily parsed
		let command = messageText.split(' ');
		console.log('bot may have been activated');
		
		// Check if the command in in the list of commands
		switch(command[0]){
			case "!test":
				Bot.say('You have summoned the powers of ' + config.username + '. If you wanted me to do anything more, you need to bug @CoderCoco!');
				break;
			case "!death":
				processDeathCommand(command);
				break;
			default:
				console.log('Bot was not activated');
		}
	}
}

/**
 * This function will perform operations for the death command.
 *
 * Supported Commands:
 *
 * !death -> Increments the death counter by one and logs a snazzy message
 * !death reset -> resets the death counter
 * !death count -> echo's the current death tally
 * !death set <integer> -> Set the death counter to the specified value
 *
 * @param {array} The command array. It can be assumed that command[0] contains the text !death
 */
function processDeathCommand(command){
	// If command.length is one then do the default command.
	if(command.length > 1){
		switch(command[1]){
			// Handle the set command
			case 'set':
			   console.log('set death counter');
			   
			   // Verify that an integer was passed as the second argument to !death
			   if(typeof command[2] != undefined && command[2].match(/^\d+$/)){
				   deathCounter = +command[2];
				   Bot.say('Death counter has been set to ' + deathCounter);
			   } else {
				   Bot.say('Command format invalid. Expected format "!death set <integer>"');
			   }
			   break;
			// Handle the reset command
			case 'reset':
			   console.log('reset death counter');
			   deathCounter = 0;
			   Bot.say('Death counter has been reset');
			   break;
			case 'count': 
			   Bot.say('You haven\'t been keeping track? The death counter is currently at ' + deathCounter);
			   break;
		}
	} else {
		deathCounter++;
		Bot.say('Looks like ' + config.channel + ' has failed again. The current death counter is now ' + deathCounter);
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('SIGINT', () => {
	console.log('Exiting the channel!');
	Bot.say('@CoderCocoBot signing out');
	Bot.close();
	
	process.exit(0);
});