const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const isloggedin = require('../middlewares/isloggedin');

// ✅ Update personal info
router.post('/update-info', isloggedin, async (req, res) => {
  try {
    const { fullname, email } = req.body;
    await userModel.findByIdAndUpdate(req.user._id, { fullname, email });
    req.flash("success", "Information updated successfully");
    res.redirect('/account');
  } catch (error) {
    req.flash("error", "Failed to update information");
    res.redirect('/account');
  }
});

// ✅ Update address
router.post('/update-address', isloggedin, async (req, res) => {
  try {
    const { street, city, state, pincode } = req.body;
    await userModel.findByIdAndUpdate(req.user._id, {
      address: { street, city, state, pincode }
    });
    req.flash("success", "Address updated successfully");
    res.redirect('/account');
  } catch (error) {
    req.flash("error", "Failed to update address");
    res.redirect('/account');
  }
});

// ✅ Update password
router.post('/change-password', isloggedin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // check if new passwords match
    if (newPassword !== confirmPassword) {
      req.flash("error", "New password and confirm password do not match");
      return res.redirect('/account');
    }

    const user = await userModel.findById(req.user._id);

    // check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash("error", "Current password is incorrect");
      return res.redirect('/account');
    }

    // hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    req.flash("success", "Password updated successfully");
    res.redirect('/account');
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update password");
    res.redirect('/account');
  }
});

module.exports = router;
