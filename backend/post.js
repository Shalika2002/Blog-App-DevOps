import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String },
  username: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
