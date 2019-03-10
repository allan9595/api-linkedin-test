const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport){
passport.use(new LinkedInStrategy({
  profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url'],
  clientID: keys.linkedinClientID,
  clientSecret: keys.linkedinClientSecret,
  callbackURL: "/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  proxy: true
}, (accessToken, refreshToken, profile, done) => {
 
    //console.log(accessToken);
    //console.log(profile);

    const image = profile.photos[0].value;
      
      const newUser = {
        linkedinID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
      }

      // Check for existing user
      User.findOne({
        linkedinID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })

      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
      });
      
  })
)}
 
