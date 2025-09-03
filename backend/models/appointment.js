const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerType: {
        type: String,
        enum: ['Member', 'Non-Member'],
        required: true,
        default: 'Non-Member'
    },
    customerPhone: {
        type: String,
        required: false
    },
    customerEmail: {
        type: String,
        required: false
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: false
    },
    duration: {
        type: String,
        required: true
    },
    serviceCount: {
        type: String,
        required: true,
        default: '1 service'
    },
    genderType: {
        type: String,
        enum: ['Male', 'Female', 'Unisex'],
        required: true,
        default: 'Unisex'
    },
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: false
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled'
    },
    price: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
