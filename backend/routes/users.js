/**
 * @module
 * @description Роутер users. Обрабатывает запросы:<br>
 *  - GET /users - возвращает данных всех пользователей<br>
 *  - GET /users/id - возвращает данные конкретного пользователя по его _id<br>
 *  - POST /users - добавляет нового пользователя<br>
 *  - PATCH /users/me — обновляет профиль<br>
 *  - PATCH /users/me/avatar — обновляет аватар
 * @since v.1.0.0
 */

const router = require('express').Router();
const {
  getUsers,
  getUserById,
  editUserProfile,
  editUserAvatar,
  getAuthorizedUser,
} = require('../controllers/users.js');

const {
  editAvatarReqValidator,
  editProfileReqValidator,
} = require('../middlewares/usersValidators');

//router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
//router.get('/:userId', getUserById);
router.patch('/me', editProfileReqValidator, editUserProfile);
router.patch('/me/avatar', editAvatarReqValidator, editUserAvatar);

module.exports = router;
