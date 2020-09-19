const express = require('express');
const line = require('@line/bot-sdk');

const postListTemplate = require('./postListTemplate')

const Post = require('../Post');
const SearchEngine = require('../SearchEngine');

let searchEngine
async function run() {
    const posts = await Post.find({
        extract: { $exists: true },
    })
    console.log('posts', posts)
    searchEngine = new SearchEngine(posts)
}
run()

const config = {
  channelAccessToken: 'dkv4IapD6OgOw8SGlwG3fqwC/bw8aFUkE5TlxVI2wNU2k/qcyCs2B9N5Mz3lMUWyc0C90TZGRFIHezqTgw9x/46z/BIiudqj4iojDu/JQ3YgS/4Hs5T/ytNQW4NJNH6Gwluq8fkCiId2gSsmC4TUsQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '388d1a8c306e8b6d2be88c5ca2214b74'
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    let posts
    switch (event.message.text) {
        case '熱門文章':
            posts = searchEngine.hot()
            break;
        case '最新文章':
            posts = searchEngine.new()
            break;
        case '隨機給我':
            posts = searchEngine.random()
            break;
        default:
            posts = searchEngine.search(event.message.text)
            break;
    }


    if (posts.length === 0) {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: '請嘗試多打點字，才能找到相關文章'
        });
    }
  return client.replyMessage(event.replyToken, postListTemplate(posts.slice(0,8)))
}

app.listen(process.env.PORT);
console.log('listen ' + process.env.PORT)