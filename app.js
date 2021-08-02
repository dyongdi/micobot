const { createEventAdapter } = require('@slack/events-api');
const { createServer } = require('http');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

// 슬랙에서 슬랙봇에게 접근가능한 엔드포인트를 만들기 위해 웹서버(express)를 사용
var express = require('express');
var app = express();
const port = process.env.PORT || 3000;
console.log(process.env.SLACK_SECRET, process.env.SLACK_BOT_TOKEN);
if (!process.env.SLACK_SECRET) {
 throw new Error('SLACK_SECRET is undefined');
}

if (!process.env.SLACK_BOT_TOKEN) {
 throw new Error('SLACK_BOT_TOKEN is undefined');
}

const slackEvents = createEventAdapter(process.env.SLACK_SECRET);
const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const til = require('./data.js');
const channelName = 'C02AEDASRNC';
const userName = new Set([
 'Q',
 'Daisy',
 'goody',
 'adela',
 'Seong',
 'eamon',
 'Tami',
 'autumn',
 'eve',
 'swing',
]);
const callName = {
 Q: '@Q',
 adela: '@Adela',
 autumn: '@Autumn',
 eve: '@eve',
 goody: '@Goody',
 swing: '@Swing',
 eamon: '@Eamon',
 Daisy: '@Daisy',
 Tami: '@Tami',
 Seong: '@Seong',
};

slackEvents.on('message', async (event) => {
 console.log(event.channel);
 if (event.channel === channelName && event.text === 'TIL') {
  console.log(
   `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
  );

  const people = await til.git_til(userName, callName);
  const result = await web.chat.postMessage({
   text: `어제 안올린 사람: ${people}`,
   channel: 'test',
  });

  console.log(
   `Successfully send message ${result.ts} in conversation ${event.channel}`
  );
 }
});

slackEvents.on('error', console.error);

app.use('/slack/events', slackEvents.requestListener());

app.use(express.json());

const server = createServer(app);
server.listen(port, () => {
 // Log a message when the server is ready
 console.log(`Listening for events on ${server.address().port}`);
});
