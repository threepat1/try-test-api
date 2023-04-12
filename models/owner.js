//import mongoose from 'mongoose';
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ownerSchema = new Schema(
  {
    // Define the properties of your animalschema here
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: String,
    country: String,
    province: String,
    city: String,
    street: String,
    age: Number,
    existingPetOwner: String,
    favorites: Array,
    password: String,
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "survey" },
  },
  {
    collection: "owner",
    timestamps: true,
  }
);
module.exports = mongoose.model("Owner", ownerSchema);
