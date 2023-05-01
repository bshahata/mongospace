const { Schema, model } = require('mongoose');
const Thought = require("./Thought");

//Schema for user 

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    virtuals: {
      friendCount: {
        get() {
          return this.friends.length;
        },
      },
    },
    toJson: {
      virtuals: true,
    },
    id: false,
  }
);

const User = model("User", userSchema);
module.exports = User;
