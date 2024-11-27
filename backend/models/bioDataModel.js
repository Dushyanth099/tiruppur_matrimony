const mongoose = require("mongoose");

const bioDataSchema = new mongoose.Schema(
  {
    name: String,
    birthDate: Date,
    religion: String,
    motherTongue: String,
    caste: String,
    subCaste: String,
    gothram: String,
    dosham: String,
    height: Number,
    familyStatus: String,
    familyType: String,
    familyValues: String,
    disability: String,
    highestEducation: String,
    employedIn: String,
    occupation: String,
    annualIncome: String,
    workLocation: String,
    state: String,
    city: String,
    about: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BioData", bioDataSchema);
