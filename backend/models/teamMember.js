const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
    //salon owner
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        enum: ['Available', 'On Leave', 'Custom Schedule'],
        default: 'Available',
        required: true
    },
    role: {
        type: String,
        requiresd: true,
        trim: true
    },
    hourlyRate: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);