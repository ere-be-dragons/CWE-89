import chalk from 'chalk';
import express from 'express'
import handlebars from 'express-handlebars';
import homeRoutes from '#routes/home';
import authRoutes from '#routes/auth';
import passport from 'passport';
import session from 'express-session';
import flash from 'modern-flash';
import userGateway from "#gateways/user";

const app = express();

app.engine('html', handlebars.engine({
  extname: '.html',
}));
app.set('views', './src/views');
app.set('view engine', 'html');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(flash());
app.use(session({
  secret: process.env.SECRET_KEY ?? 'session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
});
app.use('/', homeRoutes);

app.listen(process.env.PORT ?? '5000', () => {
  console.log(chalk.blue('[start]\t'), `available on http://localhost:${process.env.PORT ?? 5000}`);
  console.log(chalk.blue('[users]\t'), 'these users exist:', userGateway.listAll().map(u => u.name).join(', '));
  console.log(chalk.blue('[auth]\t'), 'waiting for login attempts...');
});
