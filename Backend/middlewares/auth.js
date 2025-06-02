const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token ||
            req.body.token ||
            req.header("Authorisation").replace("Bearer", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "Invalid token or missing token"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            return res.status(400).json({
                success: false,
                msg: "token is invalid"
            });
        }

        next();

    } catch (error) {
        return res.json({
            success: false,
            msg: "Something went wrong while validating"
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        const { accountType } = req.user;
        if (accountType !== "student") {
            return res.status(401).json({
                success: false,
                msg: "This is protected route for Students only"
            });
        }

        next();

    } catch (error) {
        return res.json({
            success: false,
            msg: "User role cannot be varifyid , please try again"
        })
    }
}

exports.isInstructor = async (req, res, next) => {
    try {
        const { accountType } = req.user;
        if (accountType !== "instructor") {
            return res.status(401).json({
                success: false,
                msg: "This is protected route for Instructor only"
            });
        }

        next();

    } catch (error) {
        return res.json({
            success: false,
            msg: "User role cannot be varifyid , please try again"
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        const { accountType } = req.user;
        if (accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                msg: "This is protected route for Admin only"
            });
        }

        next();

    } catch (error) {
        return res.json({
            success: false,
            msg: "User role cannot be varifyid , please try again"
        })
    }
}