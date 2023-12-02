const express = require('express');
const User = require('./../controller/Usercontroller');
const auth = require('./../controller/authController');
const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgetpassword', auth.forgetpassword);
router.patch('/updatepassword', auth.protect, auth.UpdatePassword);
router.patch('/restpassword/:token', auth.RestPassword);
router.patch('/updateMe', auth.protect, User.UpdateMe);
router.delete('/deleteMe', auth.protect, User.DeleteMe);
router.route('/').get(User.GetAllUser).post(User.CreateUser);

router.route('/:id').patch(User.UpdateUser).get(User.GetUser);

module.exports = router;
