import mongoose, { Schema, models } from 'mongoose';
import { type } from 'os';

const userSchema = new Schema(
  {
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
    plan: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
    },
     stripeCustomerId: { type: String },
    subscriptionID: {
      type: String, 
    },
    subscriptionStatus: {
      type: String, 
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'inactive'],
      default: 'inactive',
    },
    charges: [
      {
        type: String, 
      },
    ],
    lastInvoicePaid: {
      type: String, 
    },
    lastPaymentIntent: {
      type: String, 
    },
    userType: {
      type: String,
      enum: ["Entrepreneur", "Investor"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    idType: {
      type: String,
      enum: ['ID', 'Passport'],
      required: true,
    },
    investments:[{
      pitchId: {type: mongoose.Schema.Types.ObjectId, ref: 'Pitch'},
      investedAmount: Number,
      investmentDate: Date,
    }],
    idnum: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          if (this.idType === 'ID') {
            return /^\d{13}$/.test(value); 
          } else if (this.idType === 'Passport') {
            return /^[a-zA-Z0-9]{5,10}$/.test(value); 
          }
          return false;
        },
        message: (props) =>
          props.value.length === 13
            ? "ID Number must be exactly 13 digits."
            : "Passport Number must be 5 to 10 alphanumeric characters.",
      },
    },
    mentorFullName: {
      type: String,
      required: function () {
        return this.userType === 'Investor'; 
      },
    },
    mentorEmail: {
      type: String,
      required: function () {
        return this.userType === 'Investor'; 
      },
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);

export default User;
