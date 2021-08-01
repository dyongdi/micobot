const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

// 슬랙에서 슬랙봇에게 접근가능한 엔드포인트를 만들기 위해 웹서버(express)를 사용
var express = require('express');
var app = express();
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

slackEvents.start(3000).then(() => {
 console.log(`server listening `);
});

// app.use('/slack/events', slackEvents.requestListener());

// app.post('/slack/events', (req, res) => {
//  let event = req.body.event;
//  if (req.body.challenge && req.body.type == 'url_verification') {
//   res.json({ challenge: req.body.challenge });
//  }

// //  if (event.type === 'message') {
// //   console.log(`메시지 수신 channel:${event.channel}, user:${event.user}`);
// //  }
// });
// 메지지 이벤트 엔드포인트를 express 에 등록하기

// express 웹 서버 실행
// createServer(app).listen(3000, () => {
//  console.log('run slack bot');
// });
