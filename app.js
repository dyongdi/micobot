const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

// 슬랙에서 슬랙봇에게 접근가능한 엔드포인트를 만들기 위해 웹서버(express)를 사용
var express = require('express');
var app = express();
console.log(process.env.SLACK_SECRET, process.env.SLACK_BOT_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SECRET);
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

slackEvents.on('message', async (event) => {
 console.log(
  `Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`
 );
 if (event.channel === 'C02AEDASRNC' && event.text === 'TIL') {
  const result = await web.chat.postMessage({
   // We'll add more functionality in the future. We just want to test it works, first
   text: 'This should output a leaderboard',
   channel: event.channel,
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
