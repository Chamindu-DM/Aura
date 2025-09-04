const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerType: {
        type: String,
        enum: ['Member', 'Non-Member'],
        default: 'Non-Member'
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    serviceCount: {
        type: String,
        default: '1 service'
    },
    genderType: {
        type: String,
        enum: ['Male', 'Female', 'Unisex'],
        default: 'Unisex'
    },
    serviceName: String,
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember'
    },
    price: String,
    notes: String,
    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    }
}, {
    timestamps: true
});


// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
