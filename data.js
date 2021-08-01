const axios = require('axios');

const bodyParser = ({ body, base, user, number }) => {
 const info = body.split('|');
 if (info.length !== 16) return { id: -1 };
 const link = info[14].match(/\([^)]+\)/)?.[0].replace(/[\(\)]/g, '');
 return {
  id: number,
  link: link || '잘못된 링크입니다.',
  condition: parseInt(info[13].trim()),
  userImgUrl: user.avatar_url,
  userName: base.ref,
  date: info[11],
 };
};

async function git_til(users, callName) {
 process.env.TZ = 'Asia/Seoul';
 const date = new Date();
 let gapTime;

 if (date.getDay() === 1) {
  gapTime = date.getTime() - 24 * 60 * 60 * 1000 * 3;
 } else {
  gapTime = date.getTime() - 24 * 60 * 60 * 1000;
 }
 const preDate = new Date(gapTime)
  .toLocaleDateString()
  .replace(/\. /gi, '-')
  .slice(0, -1);
 console.log(preDate);
 const result = await axios(
  'https://api.github.com/repos/GleamingStar/miracle-coding/pulls?state=closed'
 ).then((res) =>
  res.data.map(bodyParser).filter(({ id, date }) => {
   //    console.log(date, preDate, date === preDate);
   return id !== -1 && date === preDate;
  })
 );
 if (result) {
  result.forEach(({ userName }) => {
   if (users.has(userName)) {
    users.delete(userName);
   }
  });
 }

 return Array.from(users)
  .map((v) => callName[v])
  .join(',');
}

module.exports.git_til = git_til;
