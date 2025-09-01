const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
    //salon owner
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Available', 'On Leave', 'Custom Schedule'],
        default: 'Available',
        required: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    hourlyRate: {
        type: String,
        default: '$0/hr'
    },
    available: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    // Bank account details
    accountHolderName: {
        type: String,
        required: false,
        trim: true
    },
    accountNumber: {
        type: String,
        required: false,
        trim: true
    },
    bankName: {
        type: String,
        required: false,
        trim: true
    },
    bankAddress: {
        type: String,
        required: false,
        trim: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);