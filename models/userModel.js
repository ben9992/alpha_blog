const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *         profileImageUrl:
 *           type: string
 *           description: The URL of the user's profile image
 *       required:
 *         - username
 *         - email
 *         - password
 */

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		profileImage: { type: String },
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		resetToken: { type: String },
		resetTokenExpiration: { type: Date },
		role: { type: String, required: true }, // user/admin
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
