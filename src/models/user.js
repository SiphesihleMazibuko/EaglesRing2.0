import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema(
  {
    avatarImage: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    userType: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    idnum: {
      type: String,
      required: true,
      match: [/^\d{13}$/, "ID Number must be exactly 13 numeric characters."],
    },
    company: {
      type: String,
      required: true,
    },
    tax: {
      type: String,
      required: true,
      match: [/^\d{13}$/, "Tax Number must be exactly 13 numeric characters."],
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);

export default User;
