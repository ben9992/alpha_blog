const express = require("express");
const cors = require("cors");
var path = require("path");
const { handleError } = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const mongooseConnectDB = require("./utils/mongo");
const swagger = require("./utils/swagger");
require("dotenv").config();

const app = express();

const dir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(dir));

mongooseConnectDB();

// Set up CORS
app.use(cors());

app.use(swagger);

// Parse JSON bodies
app.use(express.json());

// Set up routes
app.use("/api", require("./routes/index"));

// Set up error handling middleware
app.use(handleError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
