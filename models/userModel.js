const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is requires"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "Provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false, //this helps to not have it sent back as response payload
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on documnent save or create
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "Passwords do not match",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//manipulate data before it is saved in db
userSchema.pre("save", async function (next) {
  //run this function only if password is undefined
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

//everytime we're saving into to user model, check if password was changed
//if not, just move to next else, update the changedAt
userSchema.pre("save", function (next) {
    if(!this.isModified("password") || this.isNe) return next()

    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() +10 * 60 * 1000

    return resetToken
};

const User = mongoose.model("User", userSchema);

module.exports = User;
