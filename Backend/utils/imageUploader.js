const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const option = { folder };

        if (height) {
            option.height = height;
        }

        if (quality) {
            option.quality = quality;
        }

        option.resource_type = "auto"
        return await cloudinary.uploader.upload(file.tempFilePath, option)
    } catch (error) {

    }
}