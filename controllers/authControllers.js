const User = require("../models/User")
const jwt = require('jsonwebtoken')

const handleError = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' }

    // incorrect login email
    if (err.message === "Incorrect Email") {
        errors.email = "Email is not registered"
    }
    // incorrect login password
    if (err.message === "Incorrect Password") {
        errors.password = "Password is incorrect"
    }

    //validation errors
    if (err.code === 11000) {
        errors.email = 'The email is already registered';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'nikhar gupta 1313 secret', {
        expiresIn: maxAge
    })
}

const signupGet = (req, res) => {
    res.render('signup')
}

const loginGet = (req, res) => {
    res.render('login')
}

const signupPost = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
    } catch (error) {
        const errors = handleError(error);
        res.status(400).json({ errors })
    }
}

const loginPost = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors })
    }
}

const logoutGet = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}

module.exports = { signupGet, signupPost, loginGet, loginPost, logoutGet }