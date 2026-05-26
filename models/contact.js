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
    favoriteColor: {
      type: String,
      required: [true, 'favoriteColor is required'],
      trim: true,
    },
    birthday: {
      type: Date,
      required: [true, 'birthday is required'],
    },
    age: {
      type: Number,
      min: [0, 'age must be a number'],
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
