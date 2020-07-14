var express = require('express');
var router = express.Router();
let db = require('../models/db');
let {
    Editor,
    Field
} = require('datatables.net-editor-server');


const Logs = require('../models/log');


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res) {
    console.log(req.user._json.sAMAccountName);
  res.render('index', { username: req.user._json.sAMAccountName});
});

router.get('/user', ensureAuthenticated, async function(req,res) {
    res.render('users', {username: req.user.username});
})


router.all('/user/data', ensureAuthenticated, async function(req, res,next) {
    let editor = new Editor( db, 'users.prueba' )
.fields(
        new Field( 'id' ),
        new Field('username')
    );
    await editor.process(req.body);
    //res.json(editor.data());

    if(req.body.action !== undefined) {
        for (i in req.body.data){
             const userAction = {
                 username: req.user.username,
                 timestamp: Date.now(),
                 action: req.body.action,
                 activity: 'id: ' + req.body.data[i].id + 'username: ' + req.body.data[i].username
             }
             console.log(req.body.data[i].username);
             Logs.create(userAction);
        }
    }
    //res.render('bitacora', { username: req.user.username, data: JSON.stringify( editor.data() )});
    res.send( JSON.stringify( editor.data() ) );

} );

router.get('/bitacora', ensureAuthenticated, function (req, res) {
   Logs.find( function (err, docs) {
       const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
       //console.log(docs);
     res.render('bitacora', { username: req.user.username, docs: docs, options: options});
     //res.render('bitacora', { username: req.user.username});
   });
});



function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
