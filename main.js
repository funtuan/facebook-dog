const puppeteer = require('puppeteer');
const imgur = require('imgur');
const FacebookDog = require('./FacebookDog.js');

const data = {
    url: 'https://www.facebook.com/groups/tkutalk/',
    account: process.env.FB_ACCOUNT,
    password: process.env.FB_PASSWORD,
}

const facebookDog = new FacebookDog(data);
(async () => {
    await facebookDog.open();
    const posts = await facebookDog.getPosts(1);
    for (let i = 0; i < posts.length; i++) {
        for (let k = 0; k < posts[i].image.length; k++) {
            const json = await imgur.uploadUrl(posts[i].image[k])
            posts[i].image[k] = json.data.link;
            console.log(json.data.link)
        }
    }
    console.log(posts)
})();