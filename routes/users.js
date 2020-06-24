const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
    ], function (req, res, nextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req.body.password2);
  nextFunction();
})

module.exports = router;
