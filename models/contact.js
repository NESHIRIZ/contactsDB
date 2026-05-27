const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'firstName is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'lastName is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      lowercase: true,
      match: [emailRegex, 'email must be a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'phone is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'company is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'jobTitle is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'city is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'state is required'],
      trim: true,
    },
    zip: {
      type: String,
      required: [true, 'zip is required'],
      trim: true,
    },
    favoriteColor: {
      type: String,
      required: [true, 'favoriteColor is required'],
      trim: true,
    },
    birthday: {
      type: Date,
      required: [true, 'birthday is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model('Contact', contactSchema);
