require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus:200
};

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://chamindudissanayake:tyBw0CtM58jySg8T@staging-application-db.cxapigh.mongodb.net/"

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connection error:', err));

// Mount routes
const servicesRouter = require('./routes/services');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const teamMemberRouter = require('./routes/teamMembers');
const appointmentsRouter = require('./routes/appointments');

// Define routes
app.use('/api/services', servicesRouter);
app.use('/auth', authRouter); // Or app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api/team-members', teamMemberRouter);
app.use('/api/appointments', appointmentsRouter);

// Simple health endpoint
app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})