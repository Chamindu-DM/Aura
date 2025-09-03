const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const auth = require('../middleware/auth');

// Get all appointments
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ createdBy: req.userId })
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .sort({ date: 1, time: 1 });

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching appointments'
        });
    }
});

// Get appointments by date range
router.get('/date-range', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { createdBy: req.userId };
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const appointments = await Appointment.find(query)
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .sort({ date: 1, time: 1 });

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments by date range:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching appointments'
        });
    }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
    try {
        const appointmentData = {
            ...req.body,
            createdBy: req.userId
        };

        const appointment = new Appointment(appointmentData);
        await appointment.save();

        // Populate the created appointment before sending response
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: populatedAppointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating appointment'
        });
    }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        Object.assign(appointment, req.body);
        await appointment.save();

        // Populate the updated appointment
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role');

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            appointment: populatedAppointment
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating appointment'
        });
    }
});

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting appointment'
        });
    }
});

// Update appointment status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        appointment.status = status;
        await appointment.save();

        res.json({
            success: true,
            message: 'Appointment status updated successfully',
            appointment
        });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating appointment status'
        });
    }
});

module.exports = router;
