const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/user');
const router = express.Router();

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify']
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ discordId: profile.id });
  if (!user) user = await User.create({ discordId: profile.id, username: profile.username, discriminator: profile.discriminator, userObject: profile });
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)));

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => res.redirect('/'));

module.exports = router;
