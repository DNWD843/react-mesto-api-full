const router = require('express').Router();
const {
  editUserProfile,
  editUserAvatar,
  getAuthorizedUser,
} = require('../controllers/users.js');

const {
  editAvatarReqValidator,
  editProfileReqValidator,
  getUserDataReqValidator,
} = require('../middlewares/usersValidators');

router.get('/me', getUserDataReqValidator, getAuthorizedUser);
router.patch('/me', editProfileReqValidator, editUserProfile);
router.patch('/me/avatar', editAvatarReqValidator, editUserAvatar);

module.exports = router;
