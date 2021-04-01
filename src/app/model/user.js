const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user_schema = new mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    password: String,
  },
  twitter: {
    id: String,
    token: String,
    email: String,
    password: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    password: String,
  },
  list: [
    {
      description: String,
    },
  ],
});

user_schema.methods.generateHash = async (password) => {
  const data = await bcrypt.hashSync(password, await bcrypt.genSalt(8));
  this.local.password = data;
};

user_schema.methods.validatePassword = async (password) => {
  return await bcrypt.compareSync(password, await this.local.password);
};

module.exports = mongoose.model("User", user_schema);
