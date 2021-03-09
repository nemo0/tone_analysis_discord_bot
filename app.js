const Discord = require('discord.js');
require('dotenv').config();

// Tone Analyzer Credentials
// Tone Analyzer
const options = {
  apikey: process.env.WATSON_API_KEY,
  iam_apikey_description:
    'Auto-generated for key b44da232-c9cb-4b03-b30f-854683a122aa',
  iam_apikey_name: 'Auto-generated service credentials',
  iam_role_crn: 'crn:v1:bluemix:public:iam::::serviceRole:Manager',
  iam_serviceid_crn: process.env.WATSON_SERVICE_CRN,
  url: process.env.WATSON_URL,
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

client.on('message', (message) => {
  let chatsList = [];
  if (message.content == '?tone') {
    message.channel.messages.fetch().then((messages) => {
      messages.forEach((msg) => {
        if (msg.content !== '?tone') {
          let chatObj = {};
          chatObj['user'] = msg.author.username;
          chatObj['text'] = msg.content;
          chatsList.push(chatObj);
        }
      });
      // Conversation Analysis
      const toneChatParams = {
        utterances: chatsList,
      };
      toneAnalyzer
        .toneChat(toneChatParams)
        .then((utteranceAnalyses) => {
          utteranceAnalyses.result.utterances_tone.forEach((tone) => {
            client.channels.cache
              .get('818508413982081044')
              .send(`${tone.tones[0].tone_name}`);
          });
        })
        .catch((err) => {
          console.log('error:', err);
        });
      // Conversation Analysis
    });
  }
});
