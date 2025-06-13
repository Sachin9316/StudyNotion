const jwt = require('jsonwebtoken');
const User = require('../models/User')
const mailSender = require('../utils/mailSender');
const bycrpt = require('bycrpt');

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const isUserValid = await User.findOne({ email: email });

        if (!isUserValid) {
            return res.status(403).json({
                success: false,
                msg: "user is not registed, pls first create account with this emai;"
            });
        };

        const token = crypto.randomUUID();
        const updateUser = await User.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        }, {
            new: true
        });

        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email, "Password Reset Link", `Password reset Link: ${url}`);

        return res.json({
            success: true,
            msg: "Email sent successfully, please check email",
            updateUser,
        });

    } catch (error) {
        return res.json({
            success: false,
            msg: "Something went wrong while resetting the password, please try again"
        });
    };
}

// resetPassword
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        if (password !== confirmPassword) {
            return res.status(500).json({
                success: false,
                msg: "Password mismatch!"
            });
        };

        if (!token) {
            return res.json({
                success: false,
                msg: "Invalid token!"
            });
        };

        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                msg: "user does not exists!"
            });
        };

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                msg: "Token is expired, please regenrate your token"
            });
        };

        const hashedPassword = bycrpt.hash(password, 10);

        const updateUser = await User.findOneAndUpdate({
            token: token
        }, {
            password: hashedPassword,
        }, {
            new: true
        });

        return res.status(200).json({
            success: true,
            msg: "Password reset successfully",
            user: updateUser
        });
    } catch (error) {
        return res.json({
            success: false,
            msg: "Something went wrong while resetting the password!",
        });
    };
}