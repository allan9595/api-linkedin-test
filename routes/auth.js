const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/linkedin', passport.authenticate('linkedin', {scope: ['r_basicprofile', 'r_emailaddress']}));

router.get('/linkedin/callback', passport.authenticate('linkedin',  {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/dashboard');
});



router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

router.get('/logout', (req, res) => {
 req.logout();
 res.redirect('/');
});

module.exports = router;