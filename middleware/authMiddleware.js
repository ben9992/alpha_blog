const jwt = require("jwt-simple");

exports.authenticate = (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const payload = jwt.decode(token, "SECRET");
		req.user = { userId: payload.userId, role: payload.role };
		next();
	} catch (error) {
		res.status(401).json({ message: "Unauthorized" });
	}
};

exports.admin = (req, res, next) => {
	try {
		if (req.user.role === "admin") {
			next();
		} else {
			res.status(401).json({ message: "Unauthorized Admin" });
		}
	} catch (error) {
		res.status(401).json({ message: "Unauthorized" });
	}
};
