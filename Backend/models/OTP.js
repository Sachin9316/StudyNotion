const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
});

async function sendVarificationEmail(email, otp) {
    try {
        const title = "Varification email from StudyNotion";
        const response = await mailSender(email, title, otp)
        if (response) {
            console.log("Email sent successfully ", response);
            return;
        }
    } catch (error) {
        console.log("Error occured while sending mails", error.message);
        throw error;
    }
}


otpSchema.pre('save', async function (next) {
    await sendVarificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model('OTP', otpSchema);