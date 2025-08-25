const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false
    },
});

// Main schema for a service
const serviceSchema = new Schema({
    // user who created this service
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //General service information
    serviceName:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false
    },
    // A flag to know if this service has multiple options
    multipleOptions:{
        type: Boolean,
        default: false,
    },
    // Array of options for this service
    options: [optionSchema]
}, {timestamps: true});

 module.exports = mongoose.model('Service', serviceSchema);