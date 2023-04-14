const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = async (req, res, next) => {
	try {
		const { text } = req.body;
		const post = new Post({ text, user: req.user.userId });
		await post.save();
		res.status(201).json(post);
	} catch (error) {
		next(error);
	}
};

exports.getPosts = async (req, res, next) => {
	try {
		const posts = await Post.find()
			.populate("user", "username profileImage")
			.sort({ createdAt: "desc" })
			.exec();
		res.status(200).json(posts);
	} catch (error) {
		next(error);
	}
};

exports.addComment = async function addComment(req, res, next) {
	const { postId } = req.params;
	const { text } = req.body;

	try {
		// Check if the post exists
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const user = await User.findById(req.user.userId);

		// Create a new comment
		const comment = {
			text,
			author: { id: req.user.userId, username: user.username },
		};

		// Save the comment and update the post
		post.comments.push(comment);
		await post.save();

		res.status(201).json(comment);
	} catch (error) {
		next(error);
	}
};

exports.deletePost = async (req, res, next) => {
	try {
		const { postId } = req.params;
		const { userId, role } = req.user;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (post.user._id.toString() === userId || role === "admin") {
			await Post.deleteOne(post);
			return res.status(200).json({ message: "Post deleted" });
		}

		res.status(500).json({ message: "Cannot delete post" });
	} catch (error) {
		next(error);
	}
};

exports.editPost = async (req, res, next) => {
	try {
		const { postId } = req.params;
		const { text } = req.body;
		const post = await Post.findByIdAndUpdate(postId, { text }, { new: true });
		res.status(200).json(post);
	} catch (error) {
		next(error);
	}
};
