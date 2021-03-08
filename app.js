const Discord = require('discord.js');
const Twit = require('twit');
require('dotenv').config();

// Tone Analyzer Credentials
// Tone Analyzer
const options = {
  apikey: 'H9vmLmmPYCyOu5gyI5Nz4FNmYmutDzqkSgJPR8gurokI',
  iam_apikey_description:
    'Auto-generated for key b44da232-c9cb-4b03-b30f-854683a122aa',
  iam_apikey_name: 'Auto-generated service credentials',
  iam_role_crn: 'crn:v1:bluemix:public:iam::::serviceRole:Manager',
  iam_serviceid_crn:
    'crn:v1:bluemix:public:iam-identity::a/efb407a2b9a6405da7b6b5aabfcad199::serviceid:ServiceId-0a6d613d-92a7-4278-ac5a-b7595c79f8b7',
  url:
    'https://api.us-east.tone-analyzer.watson.cloud.ibm.com/instances/1170c9d4-7847-4fc1-ba4f-672f7ac52c44',
};

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: options.apikey,
  }),
  serviceUrl: options.url,
  disableSslVerification: true,
});

// Tone Analyzer Credentials Ends Here

const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

client.login(process.env.BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));

// Adding Jokes Function

// Jokes from dcslsoftware.com/20-one-liners-only-software-developers-understand/
// www.journaldev.com/240/my-25-favorite-programming-quotes-that-are-funny-too
const jokes = [
  'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
  'If doctors were like software engineers, they would say things like “Have you tried killing yourself and being reborn?”',
  '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
  'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
  'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
  'If you listen to a UNIX shell, can you hear the C?',
  'Why do Java programmers have to wear glasses? Because they don’t C#.',
  'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
  'When Apple employees die, does their life HTML5 in front of their eyes?',
  'The best thing about a boolean is even if you are wrong, you are only off by a bit.',
  'Without requirements or design, programming is the art of adding bugs to an empty text file.',
  'Before software can be reusable it first has to be usable.',
  'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
  'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
  'There are two ways to write error-free programs; only the third one works.',
];

client.on('message', (msg) => {
  if (msg.content === '?joke') {
    msg.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
  }
});

// Adding Reaction Role Function
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.channel.id == '802209416685944862') {
    if (reaction.emoji.name === '🦊') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add('802208163776167977');
    }
    if (reaction.emoji.name === '🐯') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add('802208242696192040');
    }
    if (reaction.emoji.name === '🐍') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add('802208314766524526');
    }
  } else return;
});

// Removing Reaction Roles
client.on('messageReactionRemove', async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.channel.id == '802209416685944862') {
    if (reaction.emoji.name === '🦊') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove('802208163776167977');
    }
    if (reaction.emoji.name === '🐯') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove('802208242696192040');
    }
    if (reaction.emoji.name === '🐍') {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove('802208314766524526');
    }
  } else return;
});

// Adding Twitter Forward Function
// const T = new Twit({
//   consumer_key: process.env.API_TOKEN,
//   consumer_secret: process.env.API_SECRET,
//   access_token: process.env.ACCESS_KEY,
//   access_token_secret: process.env.ACCESS_SECRET,
//   bearer_token: process.env.BEARER_TOKEN,
//   timeout_ms: 60 * 1000,
// });

// // Destination Channel Twitter Forwards
// const dest = '803285069715865601';
// // Create a stream to follow tweets
// const stream = T.stream('statuses/filter', {
//   follow: '32771325', // @Stupidcounter
// });

// stream.on('tweet', (tweet) => {
//   const twitterMessage = `Read the latest tweet by ${tweet.user.name} (@${tweet.user.screen_name}) here: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
//   client.channels.cache.get(dest).send(twitterMessage);
//   return;
// });

client.on('message', (message) => {
  console.log(
    '======================================================================='
  );
  message.channel.messages.fetch({ limit: 20 }).then((messages) => {
    let chatsList = [];
    messages.forEach((msg) => {
      let chatObj = {};
      chatObj['id'] = msg.id;
      chatObj['username'] = msg.author.username;
      chatObj['msg'] = msg.content;
      chatsList.push(chatObj);
    });
    const chatData = JSON.stringify(chatsList, null, 2);
    console.log(chatData);
    const toneParams = {
      toneInput: { text: chatData },
      contentType: 'application/json',
    };
    toneAnalyzer.tone(toneParams, (err, res) => {
      if (err) console.log('Error: ', err);
      else {
        const jsonTones = JSON.stringify(res, null, 2);
        const obj = JSON.parse(jsonTones);
        console.log(obj.result.document_tone.tones);
      }
    });
    0;
  });
});

const text =
  'Team, I know that times are tough! Product ' +
  'sales have been disappointing for the past three ' +
  'quarters. We have a competitive product, but we ' +
  'need to do a better job of selling it!';
const text2 = [
  'Team, I know that times are tough! Product ',
  'sales have been disappointing for the past three ',
  'quarters. We have a competitive product, but we ',
  'need to do a better job of selling it!',
];
