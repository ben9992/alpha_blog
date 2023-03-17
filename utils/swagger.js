const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const express = require("express");
const logger = require("./logger");
const router = express.Router();

// Set up Swagger API documentation
const swaggerOptions = {
	explorer: true,
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Alpha Blog API",
			version: "1.0.0",
			description: "API documentation for Alpha Blog",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js", "./models/*.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

logger.info("Swagger setup finished on /api-docs");

module.exports = router;
