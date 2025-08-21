require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://chamindudissanayake:tyBw0CtM58jySg8T@staging-application-db.cxapigh.mongodb.net/"

async function testDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Find all users
        const users = await User.find();
        console.log('All users in database:');
        users.forEach(user => {
            console.log(`- ID: ${user._id}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
            console.log(`  Team Size: ${user.teamSize || 'N/A'}`);
            console.log(`  Services: ${user.selectedServices ? user.selectedServices.join(', ') : 'N/A'}`);
            console.log(`  Created: ${user.createdAt || user.createdAt}`);
            console.log('  ---');
        });
        
        console.log(`Total users: ${users.length}`);
        
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Database test error:', error);
    }
}

testDatabase();
