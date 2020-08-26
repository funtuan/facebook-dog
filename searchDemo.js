const Post = require('./Post.js');
const nodejieba = require("nodejieba");

class SearchEngine {
    constructor(posts) {
        this.posts = posts
    }

    search(text) {
        const textExtract = nodejieba.extract(text, 50).map(one => one.word)
        console.log(textExtract)
        let list = this.posts.map(post => {
            const okExtract = post.extract.filter(one => textExtract.indexOf(one.word) !== -1 )
            if (okExtract.length > 0) {
                // console.log('okExtract', textExtract, post.extract, okExtract)
            }
            const rank = okExtract.reduce((count, one) => count + one.weight, 0)
            return {
                rank,
                wordExtract: okExtract.map(one => one.word),
                post,
            }
        }).filter(one => one.rank !== 0)
        list.sort((a, b) => b.rank - a.rank)
        console.log(list)
        console.log(`共 ${list.length} 筆文章符合`)
    }
}


async function run() {
    const posts = await Post.find({
        extract: { $exists: true },
    })
    const searchEngine = new SearchEngine(posts)
    searchEngine.search('學生證遺失')
}

run()