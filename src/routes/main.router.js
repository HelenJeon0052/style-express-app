const express = require('express');
const mainRouter = express.Router();
const { checkAuthentication, checkNotAuthentication } = require('../middleware/auth');

mainRouter.get('/', checkAuthentication, (req, res) => {
    res.render('/posts');
});

mainRouter.get('/about', checkAuthentication, (req, res) => {
    res.render('auth/about');
});

mainRouter.get('/login', checkNotAuthentication, (req, res) => {
    res.render('auth/login');
})

mainRouter.get('/signup', checkNotAuthentication, (req, res) => {
    res.render('auth/signup');
})

module.exports = mainRouter;