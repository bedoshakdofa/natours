const express = require('express');
const User = require('./../controller/Usercontroller');
const Auth = require('./../controller/authController');
const router = express.Router();

router.post('/signup', Auth.signup);
router.post('/login', Auth.login);
router.post('/forgetpassword', Auth.forgetpassword);
router.patch('/restpassword/:token', Auth.RestPassword);

router.use(Auth.protect);
router.patch('/updateMypassword', Auth.UpdatePassword);
router.patch('/updateMe', User.UpdateMe);
router.delete('/deleteMe', User.DeleteMe);
router.get('/getMe', User.getMe);

router.use(Auth.restrictTo('admin'));
router.route('/').get(User.GetAllUser);
router
  .route('/:id')
  .delete(User.deleteUser)
  .patch(User.UpdateUser)
  .get(User.GetUser);

module.exports = router;
