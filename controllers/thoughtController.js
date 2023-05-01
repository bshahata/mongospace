const { User, Thought } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findById(req.params.thoughtId)
      .then((thoughts) => {
        !thoughts
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thoughts);
      })
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Failed to get thought", error: err.message })
      );
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        if (!thought) {
          return res
            .status(404)
            .json({ message: "Failed to create new thought" });
        }

        User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: [thought._id] } },
          { new: true }
        ).then((user) => {
          if (!user) {
            return res.status(404).json({ message: "No user with that ID" });
          }

          res.status(201).json({
            message: "New thought created and associated with user.",
            thought,
            user,
          });
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: "Failed to create new thought.",
          error: err.message,
        })
      );
  },

  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.thoughtId, { ...req.body })
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json("Thought successfully updated");
      })
      .catch((err) =>
        res.status(500).json({
          message: "Failed to update thought",
          error: err.message,
        })
      );
  },

  deleteThought(req, res) {
    Thought.findByIdAndRemove(req.params.thoughtId)
      .then(async (deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: "No thought with that ID" });
        }

        await User.findOneAndUpdate(
          { username: deletedThought.username },
          { $pull: { thoughts: deletedThought._id } },
          { new: true }
        );
        res.json({
          message: "Thought was deleted and removed from users references",
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: "Failed to delete thought",
          error: err.message,
        })
      );
  },

  addReaction(req, res) {
    User.findById(req.body.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user with that ID" });
        }

        Thought.findByIdAndUpdate(
          req.params.thoughtId,
          {
            $push: {
              reactions: {
                reactionBody: req.body.reactionBody,
                username: user.username,
              },
            },
          },
          { new: true }
        ).then((thought) =>
          !thought
            ? res.status(404).json({ message: "No user with that ID" })
            : res.status(201).json({ message: "New reaction added", thought })
        );
      })
      .catch((err) =>
        res.status(500).json({
          message: "Failed to add reaction",
          error: err.message,
        })
      );
  },

  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $pull: { reactions: { _id: req.params.reactionsId } },
      },
      { new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.status(201).json({ message: "Reaction was deleted", thought });
      })
      .catch((err) =>
        res.status(500).json({
          message: "Failed to delete reaction",
          error: err.message,
        })
      );
  },
};