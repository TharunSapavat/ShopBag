# Advanced Role-Based System: Admin vs Co-Admin

## 🎯 Three-Tier Role System

### 1. **Admin** (Full Control) 🔴
- **Purpose:** Store owner with complete control
- **Access:** Everything
- **Cannot:** Shop (admins manage, not buy)

### 2. **Co-Admin** (Product Manager) 🔵
- **Purpose:** Product manager/assistant
- **Access:** Product management only
- **Cannot:** Manage users, shop

### 3. **User** (Customer) 🟢
- **Purpose:** Regular customer
- **Access:** Shop, cart, account
- **Cannot:** Access admin panel

---

## 📋 Permission Matrix

| Feature | Admin | Co-Admin | User |
|---------|-------|----------|------|
| View Dashboard | ✅ | ✅ | ❌ |
| Create Products | ✅ | ✅ | ❌ |
| View All Products | ✅ | ✅ | ❌ |
| Edit Products | ✅ | ✅ | ❌ |
| Delete Products | ✅ | ✅ | ❌ |
| View Users | ✅ | ❌ | ❌ |
| Make Co-Admin | ✅ | ❌ | ❌ |
| Make Admin | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| Browse Shop | ❌ | ❌ | ✅ |
| Add to Cart | ❌ | ❌ | ✅ |
| Purchase | ❌ | ❌ | ✅ |

---

## 🚫 Key Restrictions

### Admins CANNOT:
- ❌ Shop or buy products
- ❌ Access cart
- ❌ Browse shop as customer
- ❌ Remove their own admin role
- ❌ Delete their own account

### Co-Admins CANNOT:
- ❌ View user list
- ❌ Promote users to admin/co-admin
- ❌ Delete users
- ❌ Shop or buy products
- ❌ Access cart

### Users CANNOT:
- ❌ Access admin panel
- ❌ Create/edit/delete products
- ❌ View other users

---

## 🎭 Login Behavior

```
Login with credentials:
├─ If role = 'admin' → Redirect to /owners/admin
├─ If role = 'co-admin' → Redirect to /owners/admin
└─ If role = 'user' → Redirect to /shop
```

### Admin Tries to Shop:
```
Admin clicks shop link:
└─ Blocked!
   └─ Flash: "Admins cannot shop. This is a customer-only area."
   └─ Redirect to /owners/admin
```

### User Tries Admin Panel:
```
User tries /owners/admin:
└─ Blocked!
   └─ Flash: "Access denied. Admin privileges required."
   └─ Redirect to /shop
```

---

## 🛠️ How to Manage Roles

### Create Co-Admin:
1. Login as **full admin**
2. Go to "Manage Users"
3. Find user
4. Click "Make Co-Admin"

### Create Full Admin:
1. Login as **full admin**
2. Go to "Manage Users"
3. Find user
4. Click "Make Admin"

### Or Use Scripts:
```powershell
# Create admin from scratch
node createAdminQuick.js "Admin Name" "admin@shop.com" "password"

# Promote existing user to admin
node makeAdmin.js user@example.com
```

---

## 💡 Use Cases

### Scenario 1: Small Store (1 Person)
```
You → Admin
- Manage everything yourself
- No co-admins needed
```

### Scenario 2: Growing Store (2-3 People)
```
You → Admin (owner)
Assistant 1 → Co-Admin (adds products)
Assistant 2 → Co-Admin (manages inventory)
- You handle user management
- They handle products
```

### Scenario 3: Large Store (Multiple Admins)
```
Owner → Admin
Manager → Admin
Staff 1 → Co-Admin (products)
Staff 2 → Co-Admin (products)
Customers → Users (shop)
```

---

## 🔐 Security Features

### 1. Sidebar Intelligence
- **Admin sees:** Dashboard, Products, Users, Logout
- **Co-Admin sees:** Dashboard, Products, Logout (no Users)
- Dynamically changes based on role

### 2. Route Protection
- `isAdmin` middleware → Allows admin & co-admin
- `isFullAdmin` middleware → Admin only
- User management routes use `isFullAdmin`

### 3. Database-Level Roles
```javascript
role: {
    type: String,
    enum: ['user', 'co-admin', 'admin'],
    default: 'user'
}
```

### 4. Shopping Blocks
```javascript
if (req.user.role === 'admin' || req.user.role === 'co-admin') {
    // Block access to shop
}
```

---

## 📊 Admin Dashboard Differences

### Full Admin Sees:
```
📊 Dashboard
├─ Analytics cards
├─ Quick actions
└─ Note: "Full Admin Mode - Can manage products and users"
```

### Co-Admin Sees:
```
📊 Dashboard
├─ Same analytics cards
├─ Same quick actions
└─ Note: "Co-Admin Mode - Can add/delete products only"
```

---

## 🎨 Visual Indicators

### Role Badges:
- **Full Admin** → Purple badge
- **Co-Admin** → Blue badge
- **User** → Green badge

### User Stats Display:
```
Total Users: 15
Full Admins: 1
Co-Admins: 2
Regular Users: 12
```

---

## 🚀 Best Practices

### For Store Owners:
1. **Start as admin** - Full control
2. **Add co-admins** - For product management
3. **Keep admin count low** - 1-2 max
4. **Use co-admins** - For daily operations

### For Team Management:
1. **Trust levels:**
   - High trust → Admin
   - Medium trust → Co-Admin
   - Customer → User

2. **Responsibilities:**
   - Admin → Strategy, users, products
   - Co-Admin → Products only
   - User → Shopping

---

## 🔄 Promotion/Demotion Flow

```
User → Make Co-Admin → Co-Admin
User → Make Admin → Admin
Co-Admin → Demote to User → User
Admin → Demote to User → User

(Cannot):
Admin → Cannot demote self
Admin → Cannot delete self
```

---

## ⚙️ Technical Implementation

### Middleware Structure:
```
isloggedin → Check if logged in
    ├─ isAdmin → Check if admin OR co-admin
    └─ isFullAdmin → Check if admin ONLY
```

### Route Protection:
```javascript
// Both admin and co-admin can access
router.get('/products', isAdmin, ...)

// Only full admin can access
router.get('/users', isFullAdmin, ...)
```

---

## 📝 Summary

**Why Admins Can't Shop:**
- ✅ Keeps roles separate and clear
- ✅ Prevents confusion
- ✅ Professional structure
- ✅ Admins focus on management

**Why Co-Admins Exist:**
- ✅ Delegate product management
- ✅ Don't give full control
- ✅ Scale your team safely
- ✅ Trust but verify

**Why Users Only Shop:**
- ✅ Simple customer experience
- ✅ No admin distractions
- ✅ Focus on purchasing

---

Your store now has a professional three-tier role system! 🎉
