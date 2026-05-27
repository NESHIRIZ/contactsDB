const mongoose = require('mongoose');

const websiteRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'industry is required'],
      trim: true,
    },
    website: {
      type: String,
      required: [true, 'website is required'],
      trim: true,
      match: [websiteRegex, 'website must be a valid URL'],
    },
    foundedYear: {
      type: Number,
      min: [1800, 'foundedYear must be at least 1800'],
      max: [new Date().getFullYear(), 'foundedYear cannot be in the future'],
    },
    headquarters: {
      type: String,
      required: [true, 'headquarters is required'],
      trim: true,
    },
    employeeCount: {
      type: Number,
      min: [1, 'employeeCount must be at least 1'],
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

module.exports = mongoose.model('Company', companySchema);
