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
    idType: {
      type: String,
      enum: ['ID', 'Passport'], // Ensure that the type is either ID or Passport
      required: true,
    },
    idnum: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          if (this.idType === 'ID') {
            return /^\d{13}$/.test(value); // ID number must be 13 digits
          } else if (this.idType === 'Passport') {
            return /^[a-zA-Z0-9]{5,10}$/.test(value); // Passport number must be 5-10 alphanumeric characters
          }
          return false;
        },
        message: (props) =>
          props.value.length === 13
            ? "ID Number must be exactly 13 digits."
            : "Passport Number must be 5 to 10 alphanumeric characters.",
      },
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
