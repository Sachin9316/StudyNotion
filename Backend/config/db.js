const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL

const dbConnect = async () => {
    await mongoose.connect(DB_URL).then(() => {
        console.log('Db connected successfully');
    })
        .catch((error) => {
            console.log("Db connection failed", error);
            process.exit(1);
        })
}

module.exports = dbConnect;