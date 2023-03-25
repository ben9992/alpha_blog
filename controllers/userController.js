const User = require("../models/userModel");
const jwt = require("jwt-simple");

exports.register = async (req, res, next) => {
	try {
		const { username, password, email } = req.body;
		const user = new User({ username, password, email, role: "user" });
		await user.save();
		const token = jwt.encode({ userId: user.id, role: user.role }, "SECRET");
		res.status(201).json({ token, userId: user.id });
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ email: username });
		if (!user || user.password !== password) {
			throw new Error("Invalid login credentials");
		}
		const token = jwt.encode({ userId: user.id, role: user.role }, "SECRET");
		res.status(200).json({ token, userId: user.id });
	} catch (error) {
		next(error);
	}
};

exports.resetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const token = crypto.randomBytes(20).toString("hex");
		const user = await User.findOneAndUpdate(
			{ email },
			{
				resetToken: token,
				resetTokenExpiration: Date.now() + 3600000,
			}
		);
		if (!user) {
			throw new Error("User not found");
		}
		// Send email to user with reset link
		res.status(200).json({ message: "Password reset email sent" });
	} catch (error) {
		next(error);
	}
};

exports.updateProfileImage = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.userId);
		user.profileImage = req.file.path;
		await user.save();
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

exports.followUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const currentUser = await User.findById(req.user.userId);
		const userToFollow = await User.findById(userId);
		if (!userToFollow) {
			throw new Error("User not found");
		}
		if (currentUser.following.includes(userToFollow.id)) {
			throw new Error("You are already following this user");
		}
		currentUser.following.push(userToFollow.id);
		userToFollow.followers.push(currentUser.id);
		await currentUser.save();
		await userToFollow.save();
		res.status(200).json({ message: "User followed" });
	} catch (error) {
		next(error);
	}
};

exports.unfollowUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const currentUser = await User.findById(req.user.userId);
		const userToUnfollow = await User.findById(userId);
		if (!userToUnfollow) {
			throw new Error("User not found");
		}
		if (!currentUser.following.includes(userToUnfollow.id)) {
			throw new Error("You are not following this user");
		}
		currentUser.following.pull(userToUnfollow.id);
		userToUnfollow.followers.pull(currentUser.id);
		await currentUser.save();
		await userToUnfollow.save();
		res.status(200).json({ message: "User unfollowed" });
	} catch (error) {
		next(error);
	}
};

exports.getUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId).populate(
			"posts",
			"text createdAt"
		);
		if (!user) {
			throw new Error("User not found");
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find()
			.populate("posts", "text createdAt")
			.select("-password");
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};
