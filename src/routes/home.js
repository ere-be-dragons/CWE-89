import {Router} from 'express';
import {hash} from "#hash";
import * as settings from '#settings';

const router = Router();

router.get('/', function (req, res) {
  res.render('home', {
    flash: req.flash(),
    user: {name: req.user.name},
    proof: hash(settings.user.proof.salt, req.user.name, 'sha1'),
  });
});

export default router;
