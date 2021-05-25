const mongoose = require("mongoose");
const { Schema } = mongoose;

const passSchema = new Schema({
  title: {
    type: String,
    required: true,
  }, // String is shorthand for {type: String}
  description: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
