require('dotenv').config();
const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://chamindudissanayake:tyBw0CtM58jySg8T@staging-application-db.cxapigh.mongodb.net/"

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connection error:', err));

// Mount auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Simple health endpoint
app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
})