# Role-Based Authentication Guide

## What Was Implemented

You now have a complete role-based authentication system with two roles:
- **User** (default) - Can access shop, cart, account
- **Admin** - Can access admin panel, create products, manage users

---

## How It Works

### 1. User Model
- Added `role` field with values: 'user' or 'admin'
- Default role is 'user' for new registrations

### 2. Middleware Protection
- **isloggedin.js** - Protects routes that require any logged-in user
- **isAdmin.js** - Protects routes that require admin access

### 3. Login Flow
When a user logs in:
- ✅ If role = 'admin' → Redirected to `/owners/admin`
- ✅ If role = 'user' → Redirected to `/shop`

---

## How to Create an Admin User

### Method 1: Interactive Script (EASIEST)
```powershell
node createAdmin.js
```
Then follow the prompts to enter:
- Full name
- Email
- Password

### Method 2: Quick Command (FASTEST)
```powershell
node createAdminQuick.js "Admin Name" "admin@example.com" "password123"
```

### Method 3: Register Then Promote
1. Register normally at `http://localhost:3000`
2. Then run:
```powershell
node makeAdmin.js your@email.com
```

### Method 4: Manually in MongoDB
```javascript
db.users.insertOne({
  fullname: "Admin User",
  email: "admin@example.com",
  password: "$2b$10$hashedPasswordHere",  // Hash with bcrypt
  role: "admin",
  cart: [],
  orders: [],
  address: {}
})
```

---

## How to Make Someone an Admin

### Option 1: Using the Script (Recommended)
```powershell
node makeAdmin.js user@example.com
```

### Option 2: Manually in MongoDB
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 3: Create Admin User Programmatically
```javascript
const user = await userModel.create({
    email: "admin@example.com",
    password: hashedPassword,
    fullname: "Admin User",
    role: "admin"  // Set role during creation
});
```

---

## Protected Routes

### Admin Only Routes (Protected by isAdmin middleware):
- `/owners/admin` - Admin dashboard
- `/owners/create-product` - Create products page
- Any other owner routes you add

### User Routes (Protected by isloggedin middleware):
- `/shop` - Product shop
- `/cart` - Shopping cart
- `/account` - User account

---

## Testing the System

### Test 1: Login as Regular User
1. Register a new account (will be 'user' by default)
2. Login
3. Should redirect to `/shop`
4. Try accessing `/owners/admin` - Should get "Access denied" message

### Test 2: Login as Admin
1. Make a user admin: `node makeAdmin.js user@example.com`
2. Login with that account
3. Should redirect to `/owners/admin`
4. Can access all admin features
5. Can also access shop by clicking "View Shop"

### Test 3: Unauthorized Access
1. Logout
2. Try accessing `/owners/admin` directly
3. Should get "You need to login first" message

---

## File Changes Made

1. ✅ `models/user-model.js` - Added role field
2. ✅ `middlewares/isAdmin.js` - Created admin middleware
3. ✅ `controllers/authControllers.js` - Role-based redirect on login
4. ✅ `routes/ownersRouter.js` - Protected admin routes
5. ✅ `views/admin.ejs` - Added logout and view shop links
6. ✅ `makeAdmin.js` - Script to make users admin

---

## Security Features

✅ Token-based authentication (JWT)
✅ Role verification on every protected route
✅ Middleware protection against unauthorized access
✅ Flash messages for error handling
✅ Secure password hashing with bcrypt

---

## Next Steps (Optional Enhancements)

1. **Add more roles**: 'super-admin', 'moderator', etc.
2. **Admin registration page**: Separate admin registration
3. **User management**: View and edit user roles from admin panel
4. **Activity logs**: Track admin actions
5. **Permissions system**: Fine-grained permissions per role

---

## Troubleshooting

### "Access denied. Admin only"
- Your user role is 'user', not 'admin'
- Run: `node makeAdmin.js your@email.com`

### "You need to login first"
- Not logged in
- Token expired or invalid
- Clear cookies and login again

### Still redirects to shop after making admin
- Clear your browser cookies
- Login again
- Check database to confirm role is 'admin'

---

## Important Notes

⚠️ By default, ALL new users are regular users
⚠️ You must manually promote users to admin
⚠️ Admin middleware checks BOTH login AND role
⚠️ Regular users cannot access admin routes

---

Enjoy your role-based authentication system! 🎉
