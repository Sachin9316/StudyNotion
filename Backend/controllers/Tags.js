const Tags = require('../models/Tags');

exports.createTag = async (req, res) => {
    try {

        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            })
        }

        const tagDetails = await Tags.create({
            name,
            description,
        })

        return res.status(200).json({
            success: true,
            msg: "Tags saved in db successfully",
            tagDetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.showAllTags = async (req, res) => {
    try {

        const allTags = await Tags.find({}, { name: true, description: true }).populate();
        res.status(200).json({
            success: true,
            msg: "All tags return successfully",
            data: allTags
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
