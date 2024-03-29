const ApiError = require("../exceptions/apiError")

module.exports = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    return res.status(500).json({message: 'Ooops 500 ... Something wrong with server'})
}