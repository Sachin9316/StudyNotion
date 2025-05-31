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
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            if (!decode) {

                return res.status(400).json({
                    success: false,
                    msg: ""
                })
            }
        } catch (error) {

        }

    } catch (error) {

    }
}