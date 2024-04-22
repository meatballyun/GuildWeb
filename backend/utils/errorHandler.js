const CommonError = require("./error/commonError");

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'Error';
	err.message = process.env.NODE_ENV === 'development' ? err.message : CommonError[err.statusCode].MESSAGE || 'Error';
	process.env.NODE_ENV === 'development' && console.log(err.stack);

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
		data: err.status
	});
}