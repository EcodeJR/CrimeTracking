const mongoose = require("mongoose");

const ComplainantSchema = new mongoose.Schema({
  name: String,
  photo: {
    data: Buffer,
    contentType: String,
  },
  address: String,
  state: String,
  lga: String,
  gender: String,
  complexion: String,
  eyeColor: String,
  hairColor: String,
  occupation: String,
  phone: String,
  reportDate: Date,
  reportTime: String,
  remarks: String,
  officerInCharge: String,
  createdBy: String,
  updatedBy: String,
}, { timestamps: true });

module.exports = mongoose.model("Complainant", ComplainantSchema);
