const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)

const PostSchema = new mongoose.Schema({
  herf: {
    type: String,
    required: true
  },
  author: {
    herf: String,
    name: String,
  },
  image: [String],
  like: Number,
  text: String,
  utime: Number,
});

const Post = mongoose.model('Post', PostSchema)
module.exports = Post;