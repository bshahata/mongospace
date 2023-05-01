const { User, Thought } = require("../models");

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err.message));
  },

  getSingleUser(req, res) {
    User.findById(req.params.userId)
      .populate("friends")
      .populate("thoughts")
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No username with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err.message));
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err.message));
  },

  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.userId, { ...req.body }, { new: true })
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No username with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err.message));
  },

  deleteUser(req, res) {
    User.findByIdAndRemove(req.params.userId)
      .then(async (deletedUser) => {
        if (!deletedUser) {
          res.status(404).json({ message: "User not found" });
        }
        await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      })
      .then(() => res.json({ message: "User and their thoughts deleted" }))
      .catch((err) => res.status(500).json(err.message));
  },

  createFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $push: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No username with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err.message));
  },

  deleteFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No username with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err.message));
  },
};