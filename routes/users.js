const express = require('express');
const router = express.Router();
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'login'});
    next();
});

router.get('/login2', function (req, res, next) {
    res.render('login2', {title: 'login'});
    next();
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Usuario invalido'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) return done(err);
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid Password'});
                }
            });
        });

    }
));

router.get('/register', function(req, res, next) {
    res.render('register',{title:'register'});
    next();
});

const {body, validationResult} = require('express-validator');

router.post('/register',[

    body('name').exists().isLength({min: 7}),
    body('email').exists().isEmail(),
    body('username').exists().isAlphanumeric(),
    body('password').exists(),
    body('password2').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('password not match');
        }
        return true;
    })
    ], function (req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
    const newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
    });

    User.createUser(newUser, function (err, user) {
      if(err) throw err;
      console.log(user);
  });

    req.flash('success', 'Alta de usuario correcta');

    res.location('/users/register');
    res.redirect('/users/register');

});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'ahora estas desconectado');
    res.redirect('/users/login');
});

module.exports = router;
