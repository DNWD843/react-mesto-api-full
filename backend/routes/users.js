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

router.get('/', getUsers);
//router.get('/:userId', getUserById);
router.get('/me', getAuthorizedUser);
router.patch('/me', editUserProfile);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
