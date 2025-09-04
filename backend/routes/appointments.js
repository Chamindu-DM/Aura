const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/appointment');

// Get all appointments for a logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const appointments = await Appointment.find({ createdBy: userId })
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .sort({ date: 1, time: 1 })
            .lean();

        res.status(200).json({ appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            customerName,
            customerType,
            customerPhone,
            customerEmail,
            date,
            time,
            duration,
            serviceCount,
            genderType,
            serviceName,
            serviceId,
            assignedStaff,
            price,
            notes
        } = req.body;

        // Validate required fields
        if (!customerName || !customerName.trim()) {
            return res.status(400).json({message: 'Customer name is required'});
        }
        if (!date) {
            return res.status(400).json({message: 'Date is required'});
        }
        if (!time) {
            return res.status(400).json({message: 'Time is required'});
        }

        // Create appointment data object
        const appointmentData = {
            createdBy: userId,
            customerName: customerName.trim(),
            customerType: customerType || 'Non-Member',
            customerPhone: customerPhone.trim() || '',
            customerEmail: customerEmail.trim() || '',
            date,
            time,
            serviceCount: serviceCount || '1 service',
            genderType: genderType || 'Unisex',
            notes: notes?.trim() || '',
            status: 'Scheduled'
        };

        //Handle service-related data
        if (serviceId) {
            //if service id is provided, get service details from the service model
            const Service = require('../models/service');
            const service = await Service.findById(serviceId);

            if (service) {
                appointmentData.serviceId = serviceId;
                appointmentData.serviceName = service.serviceName || serviceName;

                // For duration and price, check if the service has options
                if (service.options && service.options.length > 0) {
                    //Use the first option's duration and price
                    appointmentData.duration = service.options[0].duration || duration;
                    appointmentData.price = service.options[0].price || price;
                } else {
//fallback to duration and price from request or empty string
                    appointmentData.duration = duration || '';
                    appointmentData.price = price || '';
                }
            } else {
// service not found - use values from request
                appointmentData.serviceName = serviceName || '';
                appointmentData.duration = duration || '';
                appointmentData.price = price || '';
            }
        } else {
            //no serviceId provided - use values from request
            appointmentData.serviceName = serviceName || '';
            appointmentData.duration = duration || '';
            appointmentData.price = price || '';
        }

        //ensure duration is set
        if (!appointmentData.duration) {
            return res.status(400).json({message: 'Duration is required'});
        }

        //add assigned staff if provided
        if (assignedStaff) {
            appointmentData.assignedStaff = assignedStaff;
        }

        // Crete and save the appointment
        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();

        //populate the references before returning
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .lean();

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: populatedAppointment
        });

    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({message: err.message || 'Server error'} );
    }
    });

//update appointment
router.put('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const appointmentId = req.params.id;

        //check if appintment exists and belongs to user
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            createdBy: userId
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or you are not authorized to edit it.' });
        }

        //update appointment fields
        const updateData = {...req.body};

        //update the appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            updateData,
            { new: true }
        )
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .lean();

        res.status(200).json({
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        });
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).json({ message: 'Server error' });
        }
});

// update appointment
router.put('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const appointmentId = req.params.id;

        //check if appintment exists and belongs to user
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            createdBy: userId
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or you are not authorized to edit it.' });
        }

        //update appointment fields
        const updateData = {...req.body};

        //update the appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            updateData,
            {new: true}
        )
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .lean();

        res.status(200).json({
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        });
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//update appointment status
router.patch('/:id/status', auth, async (req, res) => {
    try{
        const userId = req.user.userId;
        const appointmentId = req.params.id;
        const { status } = req.body;

        // validate status
        const validStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedAppointment = await Appointment.findOneAndUpdate(
            {_id: appointmentId, createdBy: userId},
            { status },
            { new: true }
        )
            .populate('serviceId', 'serviceName price')
            .populate('assignedStaff', 'firstName lastName role')
            .lean();

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found or you are not authorized to edit it.' });
        }

        res.status(200).json({
            message: 'Appointment status updated successfully',
            appointment: updatedAppointment
        });
    } catch (err){
        console.error('Error updating appointment status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//delete appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const appointmentId = req.params.id;

        const result = await Appointment.findOneAndDelete({
            _id: appointmentId,
            createdBy: userId
        });

        if (!result) {
            return res.status(404).json({ message: 'Appointment not found or you are not authorized to delete it.' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;