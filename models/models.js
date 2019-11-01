const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: String,
    salt: String,
    hash: String,
    firstName: String,
    lastName: String,
    department: { type: String },
    phone: { type: String }
  },
  {
    timestamps: true
  }
);

const departmentSchema = new Schema(
  {
    name: { type: String, unique: true }
  },
  {
    timestamps: true
  }
);

var User = mongoose.model("users", userSchema);
var Department = mongoose.model("departments", departmentSchema);

module.exports = { User: User, Department: Department };
