const defaultImage = 'https://lh3.googleusercontent.com/9s-9zONYk4NZvLlHVMIF5cGCzrx7PjZYQ3uow5P8Rj2Mt_XHWygV3gOt75_iI1YtTg'

module.exports = (posts) => {
    const postsTemplate = posts.map(post => {
        return {
            "thumbnailImageUrl": post.image.length>0?post.image[0]:defaultImage,
            "title": post.author.name,
            "text": post.text.substr(0, 20),
            "actions": [
              {
                "type": "uri",
                "label": "前往文章",
                "uri": post.herf,
              },
              {
                "type": "uri",
                "label": "前往作者",
                "uri": post.author.herf,
              },
            ]
        }
    })
    return {
        "type": "template",
        "altText": "幫你找到這些文章",
        "template": {
          "type": "carousel",
          "actions": [],
          "columns": postsTemplate,
        }
    }
}