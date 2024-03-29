const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the post
 *         text:
 *           type: string
 *           description: The text content of the post
 *         author:
 *           $ref: '#/components/schemas/User'
 *           description: The author of the post
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: The comments associated with the post
 *       required:
 *         - text
 *         - author
 */

const postSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				author: {
					id: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					username: {
						type: String,
						required: true,
					},
				},
				createdAt: {
					type: mongoose.Schema.Types.Date,
					required: true,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
