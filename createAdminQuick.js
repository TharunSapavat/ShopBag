// Quick script to create admin user with command line arguments
// Usage: node createAdminQuick.js "Full Name" "email@example.com" "password"

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const config = require('config');

// Connect to database - same as your app
mongoose.connect(`${config.get("MONGODB_URI")}/ShopBag`)
    .then(() => console.log('Connected to database'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

const userModel = require('./models/user-model');

async function createAdminQuick(fullname, email, password) {
    try {
        // Validate arguments
        if (!fullname || !email || !password) {
            console.log('❌ Usage: node createAdminQuick.js "Full Name" "email@example.com" "password"');
            console.log('Example: node createAdminQuick.js "John Doe" "admin@shop.com" "admin123"');
            process.exit(1);
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log(`❌ User with email "${email}" already exists`);
            console.log(`To make them admin, run: node makeAdmin.js ${email}`);
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const admin = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('\n✅ Admin user created successfully!');
        console.log(`   Name: ${admin.fullname}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log('\nYou can now login at http://localhost:3000\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Get arguments from command line
const [,, fullname, email, password] = process.argv;
createAdminQuick(fullname, email, password);
