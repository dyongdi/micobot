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
async function git_til() {
 const result = await axios(
  'https://api.github.com/repos/GleamingStar/miracle-coding/pulls?state=closed'
 ).then((res) => res.data.map(bodyParser).filter(({ id }) => id !== -1));
 console.log(result);
 return result[0];
}

module.exports.git_til = git_til;
