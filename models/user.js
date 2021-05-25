const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pass = require("./passentry.js");
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  confirmpassword: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.virtual("passwords", {
  ref: "Pass",
  localField: "_id",
  foreignField: "owner",
});
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.confirmpassword;
  delete userObject.tokens;
  return userObject;
};

UserSchema.methods.GenerateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "password");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  console.log("user saved here");
  return token;
};
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("incorrect password");
  }

  return user;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.pre("remove", async function (next) {
  await Pass.deleteMany({ owner: user._id });
  next();
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
