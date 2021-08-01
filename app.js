
const { createEventAdapter } = require("@slack/events-api");
const { createServer } = require("http");
require("dotenv").config();

// 슬랙에서 슬랙봇에게 접근가능한 엔드포인트를 만들기 위해 웹서버(express)를 사용
var express = require("express");
var app = express();
console.log(process.env.SLACK_SECRET)
const slackEvents = createEventAdapter(process.env.SLACK_SECRET);

// 메시지 이벤트 구독하기
slackEvents.on("message", async (event) => {
  console.log(event);
});

// 메지지 이벤트 엔드포인트를 express 에 등록하기
app.use("/slack/events", slackEvents.requestListener());

// express 웹 서버 실행
createServer(app).listen(3000, () => {
  console.log("run slack bot");
});
