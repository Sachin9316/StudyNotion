const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Send Otp

exports.sentOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            res.status(401).json({
                success: false,
                msg: "email already exists"
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let isUniqueOtp = await OTP.findOne({ otp: otp })

        while (isUniqueOtp) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            isUniqueOtp = await OTP.findOne({ otp: otp })
        };

        const otpPayload = { email, otp };

        const otpBody = await OTP.create(otpPayload);
        console.log("otpBody", otpBody);

        res.status(200).json({
            success: true,
            msg: "OTP sent successfully",
            otp: otp
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: error.message
        })
    }
}

//signup

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, conatctNumber, otp } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                msg: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: "Password mismatch try again"
            });
        }

        const isCheckUserExists = await User.findOne({ email });
        if (isCheckUserExists) {
            res.status(401).json({
                success: false,
                msg: "user already exists"
            });
            return;
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log({ recentOtp });
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                msg: "Otp not found"
            });
        } else if (otp !== recentOtp) {
            return res.status(401).json({
                success: false,
                msg: "Invalid otp"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const userPayload = { firstName, lastName, email, password: hashedPassword, accountType, conatctNumber, otp, additionalDetails: profileDetails._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`, }

        const user = await User.create(userPayload);

        return res.json(200).json({
            success: true,
            msg: "Account created successfully!",
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

// login

exports.login = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        const isCheckUserExists = await User.findOne({ email }).populate("additionalDetails");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Enter email and password"
            })
        }

        if (!isCheckUserExists) {
            return res.status(401).json({
                success: false,
                msg: "Email does not exists"
            });
        }

        if (await bcrypt.compare(password, isCheckUserExists.password)) {

            const payload = {
                email: isCheckUserExists.email,
                is: isCheckUserExists._id,
                role: isCheckUserExists.role
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

            isCheckUserExists.token = token;
            isCheckUserExists.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            return res.cookie("token", token, options).status(200).json({
                success: true,
                msg: "Logged in successfull",
                token,
                user: isCheckUserExists
            })

        } else {
            return res.status(4001).json({
                success: false,
                msg: "Password is incorrect"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const isCheckUserExists = await User.findOne({ email });

        if (!isCheckUserExists) {
            return res.status(401).json({
                success: false,
                msg: "Email does not exists"
            });
        }

    } catch (error) {

    }
}