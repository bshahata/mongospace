const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/tags/:userId and get put and delete request for user
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// api/Users/:userId/friends/:friendId and post and delete request for friend
router.route("/:userId/friends/:friendId").post(createFriend).put(deleteFriend);

module.exports = router;
