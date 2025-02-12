const cookieSession = require('cookie-session');
const express = require('express');
const { default: mongoose } = require('mongoose');


const app = express();
const passport = require('passport');
const flash=require('connect-flash')
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

const config = require('config');
const mainRouter = require('./routes/main.router')
const usersRouter = require('./routes/users.router')
const postsRouter = require('./routes/posts.router')
const commentsRouter = require('./routes/comments.router')
const profileRouter = require('./routes/profile.router');
const likesRouter = require('./routes/likes.router');
const followersRouter = require('./routes/followers.router');


const serverConfig = config.get('server')

const port = serverConfig.port
require('dotenv').config()
//const port = process.env.PORT || 8080

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY]
}))

app.use(flash())
app.use(methodOverride('_method'))

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

//passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

// view engine config
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongodb connected')
    })
    .catch((err) => {
        console.log('err');
        process.exit()
    })

app.use('/static', express.static(path.join(__dirname, 'public')));

/**
 * user alert
 * once perform delete in session
 */

app.get('/send',(req,res)=>{
    //req.flash('키','정보')
    req.flash('post success','successful')
    res.redirect('/receive')
})

app.get('/receive', (req,res)=>{
    res.send(req.flash('post success')[0])
})

//flash middleware
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg'); // needed for flash to work
    res.locals.error_msg = req.flash('error_msg');     // needed for flash to work
    res.locals.error = req.flash('error');             // needed for flash to work
    res.locals.currentUser = req.user
    next();
  })

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/comments', commentsRouter);
app.use('/profile/:id', profileRouter);
app.use('/followers', followersRouter)
app.use(likesRouter)

//err
app.use((err, req, res, next)=>{
    res.status(err.status||500)
    res.send('error')
})

app.listen(port, () => {
    console.log(`${port}`);
})