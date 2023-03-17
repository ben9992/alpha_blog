const mongoose = require("mongoose");
const logger = require("./logger");

const mongoCS =
	"mongodb+srv://JosephWAdmin:1234@cluster0.bnmes.mongodb.net/alpha-blog?retryWrites=true&w=majority";

function mongooseConnectDB() {
	// Connect to MongoDB
	mongoose
		.connect(mongoCS, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => logger.info("MongoDB connected"))
		.catch((error) => logger.error(error));
}

module.exports = mongooseConnectDB;
