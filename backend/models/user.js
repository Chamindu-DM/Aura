const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: {
      type: String,
      required: true,
  },
  firstName:{
    type: String,
    required: false
  },
  lastName:{
    type: String,
    required: false
  },
    profilePic:{
    type: String,
    default: null,
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

  salonName:{
      type: String,
      default: null,
  },
    salonLocation:{
      type: String,
        default: null,
    },
    onboardingCompleted: {
      type: Boolean,
        default: false,
    },
}, { timestamps: true}
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try{
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (err){
      next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
