const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function(req, res, next) {
    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");
        
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        // Check if user is admin or co-admin
        if (user.role !== 'admin' && user.role !== 'co-admin') {
            req.flash("error", "Access denied. Admin privileges required.");
            return res.redirect("/shop");
        }

        req.user = user;
        next();
    } catch (err) {
        req.flash("error", "Something went wrong");
        res.redirect("/");
    }
};
