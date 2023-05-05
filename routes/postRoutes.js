const express = require("express");
const router = express.Router();
const {
	createPost,
	getPosts,
	addComment,
	deletePost,
	deleteComment,
	editComment,
	postsAnalytics,
	editPost,
} = require("../controllers/postController");
const { authenticate } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text content of the post
 *             example:
 *               text: "This is a new post!"
 *     responses:
 *       201:
 *         description: The newly created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", authenticate, createPost);
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/analytics/all", authenticate, postsAnalytics);
router.get("/", getPosts);
/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add a new comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to add the comment to
 *       - in: body
 *         name: comment
 *         schema:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             text:
 *               type: string
 *               description: The text content of the comment
 *           example:
 *             text: "This is a new comment!"
 *     responses:
 *       201:
 *         description: The newly added comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/:postId/comments", authenticate, addComment);
/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         description: Not found
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:postId/", authenticate, deletePost);
/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Edit a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         description: Not found
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/:postId", authenticate, editPost);

router.delete("/comments/:postId/:commentId", authenticate, deleteComment);

router.put("/comments/:postId/:commentId", authenticate, editComment);

module.exports = router;
