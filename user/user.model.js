const mongoose = require("mongoose");

/**
 * @typedef {{
 *  _id: string,
 *  name: string,
 *  age: number,
 *  job: string
 *  created_at: Date,
 *  updated_at: Date,
 * }} User
 */

const UserSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    job: String,
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
