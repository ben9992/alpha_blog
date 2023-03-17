exports.handleError = (error, req, res, next) => {
	console.error(error.stack);
	res.status(500).json({ message: error.message });
};
