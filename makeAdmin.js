// Script to make a user an admin
// Run this with: node makeAdmin.js <email>

const mongoose = require('mongoose');
require('dotenv').config();
const config = require('config');

// Connect to database - same as your app
mongoose.connect(`${config.get("MONGODB_URI")}/ShopBag`)
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Database connection error:', err));

const userModel = require('./models/user-model');

async function makeAdmin(email) {
    try {
        if (!email) {
            console.log('Usage: node makeAdmin.js <email>');
            process.exit(1);
        }

        const user = await userModel.findOne({ email: email });
        
        if (!user) {
            console.log(`User with email "${email}" not found`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ User "${user.fullname}" (${email}) is now an admin!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Get email from command line arguments
const email = process.argv[2];
makeAdmin(email);
