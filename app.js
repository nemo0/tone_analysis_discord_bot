const Discord = require('discord.js');
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

client.on('message', (message) => {
  if (message.content == '?tone') {
    message.channel.messages.fetch({ limit: 50 }).then((messages) => {
      let chatsList = [];
      let tonesList = [];
      messages.forEach((msg) => {
        let chatObj = {};
        chatObj['user'] = msg.author.username;
        chatObj['text'] = msg.content;
        chatsList.push(chatObj);
      });
      // Conversation Analysis
      const toneChatParams = {
        utterances: chatsList,
      };
      toneAnalyzer
        .toneChat(toneChatParams)
        .then((utteranceAnalyses) => {
          utteranceAnalyses.result.utterances_tone.forEach((tone) => {
            if (tone.tones[0] !== undefined) {
              console.log(tone.tones[0].tone_name);
              message.channel.send(tone.tones[0].tone_name);
              tonesList.push(tone.tones[0].tone_name);
            }
          });
        })
        .catch((err) => {
          console.log('error:', err);
        });
      // Conversation Analysis
    });
  }
});
