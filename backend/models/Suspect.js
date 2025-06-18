const mongoose = require("mongoose");

const SuspectSchema = new mongoose.Schema({
  name: String,
  photo: {
    data: Buffer,
    contentType: String,
  },
  thumbprint: {
    data: Buffer,
    contentType: String,
  },
  crimeCode: String,
  arrestDate: Date,
  address: String,
  state: String,
  lga: String,
  gender: String,
  age: Number,
  complexion: String,
  height: Number,
  weight: Number,
  remarks: String,
  officerInCharge: String,
  createdBy: String,
  updatedBy: String,
}, { timestamps: true });

module.exports = mongoose.model("Suspect", SuspectSchema);
