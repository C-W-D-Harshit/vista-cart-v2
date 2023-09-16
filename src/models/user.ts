import mongoose, { Schema, models } from "mongoose";
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["github", "google", "credentials"],
      default: "credentials",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "seller"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "blocked"],
      default: "active",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async (candi, user) => {
  return await bcrypt.compare(candi, user);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  const timestamp = parseInt(this.passwordChangedAt?.getTime() / 1000);
  return JWTTimestamp < timestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = models.User || mongoose.model("User", userSchema);

export default User;
