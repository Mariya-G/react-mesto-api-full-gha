const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { singOut } = require('../controllers/users');
const NotFound = require('../errors/not_found'); // 404

router.get('/signout', singOut);
router.use('/', auth, usersRouter);
router.use('/', auth, cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
