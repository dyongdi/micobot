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

async function git_til(users) {
 process.env.TZ = 'Asia/Seoul';
 const date = new Date();
 let gapTime;
 console.log(date.getDay());
 if (date.getDay() === 1) {
  console.log('ee');
  gapTime = date.getTime() - 24 * 60 * 60 * 1000 * 2;
 } else {
  gapTime = date.getTime() - 24 * 60 * 60 * 1000;
 }
 const preDate = new Date(gapTime).toISOString().slice(0, 10);

 const result = await axios(
  'https://api.github.com/repos/GleamingStar/miracle-coding/pulls?state=closed'
 ).then((res) =>
  res.data.map(bodyParser).filter(({ id, date }) => {
   console.log(date, preDate, date === preDate);
   return id !== -1 && date === preDate;
  })
 );
 if(result){
    result.forEach(({userName})=>{
        if(users.has(userName)){
            users.delete(userName)
        }  
    })
 }
 console.log(Array.from(users),join(','));
 
 return Array.from(users),join(',');
}

module.exports.git_til = git_til;
