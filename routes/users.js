const express = require('express');
const router = express.Router();
//local-auth
//const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

//ldap auth
const passport = require('passport');
const ActiveDirectoryStrategy = require('passport-activedirectory');


const User = require('../models/user');
const Log = require('../models/log');
//const dbUser = require('../models/mongodb');

passport.use(new ActiveDirectoryStrategy({
    integrated: false,
    ldap: {
        url: 'ldap://ec2-34-214-159-87.us-west-2.compute.amazonaws.com',
        baseDN: 'CN=Users,DC=example,DC=com',
        username: 'ZACZAN@example.com',
        password: 'password'
    }
}, function (profile, ad, done) {
    ad.isUserMemberOf(profile._json.dn, 'CN=Users,DC=ohsecure,DC=com', function (err, isMember) {
        if (err) return done(err)
        return done(null, profile)
    })
}))

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'login'});
    next();
});

//local auth
//router.post('/login',
//    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true})
//);

//ldap-auth
const opts = { failWithError: true }
router.post('/login', passport.authenticate('ActiveDirectory', opts), function(req, res) {
    //res.json(req.user);
    res.redirect('/');
}, function (err) {
    res.status(401).send('Not Authenticated')
})

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

//passport.serializeUser(function(user, done) {
//    console.log(user.id);
//    done(null, user.id);
//});
//
//passport.deserializeUser(function(id, done) {
//    User.findById(id, function(err, user) {
//        done(err, user);
//    });
//});
//
//passport.use(new LocalStrategy(
//    function(username, password, done) {
//        User.findOne({username: username}, function(err, user) {
//            if (err) { return done(err); }
//            if (!user) {
//                return done(null, false, { message: 'Usuario invalido'});
//            }
//            User.comparePassword(password, user.password, function(err, isMatch){
//                if(err) return done(err);
//                if(isMatch){
//                   const userlogs = {
//                        username: user.username,
//                        timestamp: Date.now(),
//                        action: 'login',
//                        activity: null
//                    }
//                    Log.create(userlogs);
//                    return done(null, user);
//                } else {
//                    return done(null, false, { message: 'Invalid Password'});
//                }
//            });
//        });
//
//    }
//));

router.get('/register', ensureAuthenticated, function(req, res, next) {
    res.render('register',{username: req.user.username});
    next();
});

const {body, validationResult} = require('express-validator');

router.post('/register',[

    body('name').exists().isLength({min: 7}).withMessage('Nombre: minimo 7 caracteres'),
    body('email').exists().isEmail().withMessage('Email: Formato de correo invalido'),
    body('username').exists().isAlphanumeric().withMessage('Usuario: solo con letras y numeros'),
    body('password').exists(),
    body('password2').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('las contraseñas no coinciden');
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
    //return res.status(422).json({errors: errors.array()});
    return res.render('register', {username: req.user.username, errors: errors.array()});
  }
    const newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
    });

    User.createUser(newUser, function (err, user) {
      if(err) throw err;
        const registerlog = {
            username: req.user.username,
            action: req.originalUrl,
            activity: 'nombre: '+ user.name + ', email: ' + user.email + ', username: ' + user.username
        }
        Log.create(registerlog);
      console.log(user);

  });


    req.flash('success', 'Alta de usuario correcta');

    res.location('/users/register');
    res.redirect('/users/register');

});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

router.get('/logout', function (req, res) {
    const userlogout = {
        username: req.user.username,
        timestamp: Date.now(),
        action: 'logout',
        activity: null
    }
    Log.create(userlogout);
    req.logout();
    req.flash('success', 'ahora estas desconectado');
    res.redirect('/users/login');
});

module.exports = router;
