var express = require('express');
var router = express.Router();

const bitacora = require('../models/log');


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('index', { username: req.user.username });
});

router.get('/bitacora', ensureAuthenticated, function (req, res) {
   bitacora.find( function (err, docs) {
       const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
     res.render('bitacora', { username: req.user.username, docs: docs, options: options});
   });


});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
