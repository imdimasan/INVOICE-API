const userService = require("../service/userService")
const {validationResult} = require("express-validator")
const ApiError = require("../exceptions/apiError")

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }

            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})

            return res.json(userData)
        } catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            return res.json(userData)
            
        } catch (error) {
            next(error)
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }
    async users(req, res, next) {
        try {
            const users = await userService.getAllUsers(req.user.id)
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }
    async profile(req, res, next) {
        try {
            const { id } = req.user
            const { body } = req
            const profile = await userService.updateProfile(id, body)
            
            return res.json(profile)
        } catch (error) {
            next(error)
        }
    }
}


module.exports = new UserController()