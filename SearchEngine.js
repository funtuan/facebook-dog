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
        return list.map(one => one.post)
    }

    hot() {
        const list = this.posts.filter(({utime}) => utime > ((+new Date()/1000) - 30*24*60*60))
        list.sort((a, b) => b.like - a.like)

        return list
    }

    new() {
        const list = this.posts.map(one => one)
        list.sort((a, b) => b.utime - a.utime)

        return list
    }

    random() {
        const list = this.posts.map(post => {
            return {
                post,
                random: Math.random(),
            }
        })
        list.sort((a, b) => b.random - a.random)

        return list.map(one => one.post)
    }

    
}


async function run() {
    const posts = await Post.find({
        extract: { $exists: true },
    })
    const searchEngine = new SearchEngine(posts)
    searchEngine.search('學生證遺失')
}

// run()

module.exports = SearchEngine