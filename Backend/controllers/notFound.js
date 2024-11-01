//For routes that is not included in our application

const notFound = (re, res, next) => {
    res.status(404).json({code:404, message : "Page not found", status : false});
}

module.exports = notFound