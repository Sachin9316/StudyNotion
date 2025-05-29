const nodeMailer = require('nodemailer');


const mailSender = async (email, title, body) => {
    try {
        let transPorter = nodeMailer.transPorter({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transPorter.sendMail({
            from: 'StudyNotion || Codehelp - by Sachin',
            to: `${email}`,
            subject: title,
            html: body
        })

        console.log("info", info);
        return info;

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;