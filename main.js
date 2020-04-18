const puppeteer = require('puppeteer');
const imgur = require('imgur');
const FacebookDog = require('./FacebookDog.js');
const Post = require('./Post.js');

const data = {
    url: 'https://www.facebook.com/groups/tkutalk/',
    account: process.env.FB_ACCOUNT,
    password: process.env.FB_PASSWORD,
}
    
const facebookDog = new FacebookDog(data);
(async () => {
    await facebookDog.open();
    let posts = await facebookDog.getPosts(1);
    console.log(posts)
    for (let i = 0; i < posts.length; i++) {
        savePost(posts[i])
    }
})();

async function savePost(newPost) {
    const isPosts = await Post.find({herf: newPost.herf})
    if (isPosts.length > 0) {
        isPosts[0].like = newPost.like
        await isPosts[0].save()
        console.log('change')
    } else {
        const post = new Post(newPost)
        await post.save()
        console.log('save')
    }
}