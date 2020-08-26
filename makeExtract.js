const Post = require('./Post.js');
const nodejieba = require("nodejieba");

async function run() {
    const posts = await Post.find({
    })
    for (const post of posts) {
        post.extract = nodejieba.extract(post.text, 50)
        console.log(post.extract)
        await post.save()
    }
    console.log(`更改 ${posts.length} 筆內容`)
}

run()