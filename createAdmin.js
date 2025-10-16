// Script to create a new admin user
// Run this with: node createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log('\n=== Create Admin User ===\n');

        const fullname = await question('Enter full name: ');
        const email = await question('Enter email: ');
        const password = await question('Enter password (min 6 characters): ');

        // Validate input
        if (!fullname || fullname.length < 3) {
            console.log('❌ Full name must be at least 3 characters');
            process.exit(1);
        }

        if (!email || !email.includes('@')) {
            console.log('❌ Please enter a valid email');
            process.exit(1);
        }

        if (!password || password.length < 6) {
            console.log('❌ Password must be at least 6 characters');
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log(`❌ User with email "${email}" already exists`);
            
            const makeAdmin = await question('Do you want to make them admin? (yes/no): ');
            if (makeAdmin.toLowerCase() === 'yes' || makeAdmin.toLowerCase() === 'y') {
                existingUser.role = 'admin';
                await existingUser.save();
                console.log(`✅ User "${existingUser.fullname}" is now an admin!`);
            }
            process.exit(0);
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
        console.log('\nYou can now login with these credentials at http://localhost:3000\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
