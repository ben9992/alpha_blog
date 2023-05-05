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

exports.postsAnalytics = async (req, res, next) => {
	try {
		const posts = await Post.find();
		if (!posts) {
			throw new Error("Posts Analytics fail");
		}

		const data = {
			postCount: posts.length,
		};
		res.status(200).json(data);
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
			await Post.findOneAndDelete({ _id: postId });
			return res.status(200).json({ message: "Post deleted" });
		}

		res.status(500).json({ message: "Cannot delete post" });
	} catch (error) {
		next(error);
	}
};

exports.userRemoved = async (userId) => {
	try {
		Post.updateMany(
			{ "comments.author.id": userId },
			{ $pull: { comments: { "author.id": userId } } }
		).then(() => {
			console.log("Successfully removed comments authored by user:", userId);

			// Delete posts with user
			Post.deleteMany({ user: userId }).then(() => {
				console.log("Successfully deleted all posts with user:", userId);
			});
		});
	} catch (error) {
		next(error);
	}
};

exports.deleteComment = async (req, res, next) => {
	try {
		const { commentId, postId } = req.params;
		const { userId, role } = req.user;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		for (const comment of post.comments) {
			if (comment.author.id.toString() === userId || role === "admin") {
				if (comment._id.toString() === commentId) {
					Post.updateOne(
						{ _id: postId },
						{ $pull: { comments: { _id: comment._id } } }
					)
						.then((res) => {})
						.catch((err) => {});
					return res.status(200).json({ message: "Comment deleted" });
				}
			}
		}

		res.status(500).json({ message: "Cannot delete comment" });
	} catch (error) {
		next(error);
	}
};

exports.editComment = async (req, res, next) => {
	try {
		const { commentId, postId } = req.params;
		const { userId, role } = req.user;
		const { text } = req.body;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		let isFounded = false;
		for await (const comment of post.comments) {
			if (comment.author.id.toString() === userId || role === "admin") {
				if (comment._id.toString() === commentId) {
					isFounded = true;
					await Post.findOneAndUpdate(
						{ _id: postId, "comments._id": commentId },
						{ $set: { "comments.$": { text: text, author: comment.author } } },
						{ new: true }
					)
						.then(() => {
							return res.status(200).json({ message: "Comment updated" });
						})
						.catch((err) => {
							return res.status(500).json({ message: "Cannot update comment" });
						});
				}
			}
		}
		if (!isFounded) res.status(500).json({ message: "Cannot delete comment" });
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
