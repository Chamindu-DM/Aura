const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  firstName:{
    type: String,
    required: false
  },
  lastName:{
    type: String,
    required: false
  },
  selectedServices:{
    type:[String],
    default:[]
  },
  teamSize:{
    type: String,
    enum:['myself', 'small', 'growing', 'medium','large'],
    required: false
  },
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);
