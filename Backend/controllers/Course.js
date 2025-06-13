const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.createCourse = async (req, res) => {
    try {
        const { coureName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        const thumbnail = req.files.thumbnailImage;

        if (!courseName || !courseDescription || !price || !tag || !whatYouWillLearn) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            });
        }

        const userId = req.user.id;
        const instuctorDetails = await User.findById(userId);
        console.log(instuctorDetails);

        if (!instuctorDetails) {
            return res.status(400).json({
                success: false,
                msg: "Instructor details not found"
            })
        }

        const tagDetails = await Tag.findById(tag);

        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                msg: "Tag details not found"
            })
        }

        const thumbnaiImage = await uploadImageToCloudinary(thumbnaiImage, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instuctorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnaiImage.secure_url,
        })

        await User.findByIdAndUpdate({
            _id: instuctorDetails._id
        },

            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {
                new: true,
            }
        );

        await Tag.findByIdAndUpdate(
            { _id: tagDetails._id },
            {
                $push: {
                    course: newCourse._id
                }
            },
            {
                new: true
            }
        )

        return res.status(200).json({
            success: true,
            msg: "Course created successfully",
            data: newCourse,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, { courseName: true, price: true, thumbnail: true, instructor: true, ratingAndReviews: true, studentEnrolled: true }).populate('instructor').exec();
        return res.status(200).json({
            success: true,
            message: 'All Courses are fetched successfully',
            data: allCourses
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.nessage
        })
    }
}