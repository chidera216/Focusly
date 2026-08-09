import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },

  emailVerificationExpires: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
