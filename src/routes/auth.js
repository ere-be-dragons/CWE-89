import chalk from 'chalk';
import {Router} from 'express';
import passport from "passport";
import LocalStrategy from 'passport-local';
import userGateway from "#gateways/user";

passport.use(new LocalStrategy(function (username, password, cb) {
  const user = userGateway.authenticate(username, password);

  if (!user) return cb(null, false);

  cb(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = userGateway.getById(id);
  done(null, user);
});

const router = Router();

router.get('/logout', (req, res) => {
  if (req.user)
    return req.logout(() => {
      res.redirect('/login');
    });

  res.redirect('/login');
});

router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('login.html', {flash: req.flash()});
});

router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    (err, user, info) => {
      if (!user) {
        console.log(chalk.blue('[auth]\t'), chalk.red('failure'), `${req.body.username}:${req.body.password}`);
        req.flash('error', 'Invalid username or password.');
        return res.redirect('/login');
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        console.log(chalk.blue('[auth]\t'), chalk.green('success'), `${req.body.username}:${req.body.password}`);
        req.flash('success', 'Login successful!'); // Set success message
        return res.redirect('/');
      });
    },
  )(req, res, next);
});

export default router;
