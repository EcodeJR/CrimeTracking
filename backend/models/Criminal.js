const mongoose = require("mongoose");

const CriminalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  photo: { data: Buffer, contentType: String },
  thumbprint: { data: Buffer, contentType: String },
  crimeCode: { 
    type: String, 
    required: [true, 'Crime code is required'] 
  },
  arrestDate: Date,
  convictDate: Date,
  address: String,
  state: String,
  lga: String,
  gender: String,
  age: { 
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot be more than 150']
  },
  complexion: String,
  height: Number,
  weight: Number,
  remarks: String,
  officerInCharge: String,
  createdBy: String,
  updatedBy: String,
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model("Criminal", CriminalSchema);
// This schema defines the structure of a Criminal document in MongoDB.
// It includes fields for personal details, crime information, and metadata for tracking changes.