const Attendance = require("./attendance.model");

const cloudinary = require("../../config/cloudinary");

const {
    validateOfficeRadius
} = require("../../utils/geo");

const punchIn = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        const today = new Date().toISOString().split("T")[0];

        // Prevent duplicate punch in
        const existingAttendance =
            await Attendance.findOne({
                userId: req.user.id,
                date: today
            });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "Already punched in today"
            });
        }

        // Geo validation
        const isInsideOffice =
            validateOfficeRadius(
                Number(lat),
                Number(lng)
            );

        if (!isInsideOffice) {
            return res.status(400).json({
                success: false,
                message: "You are outside office radius"
            });
        }

        // Upload image
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "attendance"
            }
        );

        const attendance =
            await Attendance.create({
                userId: req.user.id,

                date: today,

                punchIn: {
                    time: new Date(),

                    selfie: result.secure_url,

                    location: {
                        lat,
                        lng
                    }
                }
            });

        res.status(201).json({
            success: true,
            message: "Punch in successful",
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const punchOut = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        const today = new Date().toISOString().split("T")[0];

        const attendance =
            await Attendance.findOne({
                userId: req.user.id,
                date: today
            });

        if (!attendance) {
            return res.status(400).json({
                success: false,
                message: "Please punch in first"
            });
        }

        if (attendance.punchOut?.time) {
            return res.status(400).json({
                success: false,
                message: "Already punched out"
            });
        }

        // Geo validation
        const isInsideOffice =
            validateOfficeRadius(
                Number(lat),
                Number(lng)
            );

        if (!isInsideOffice) {
            return res.status(400).json({
                success: false,
                message: "You are outside office radius"
            });
        }

        // Upload image
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "attendance"
            }
        );

        attendance.punchOut = {
            time: new Date(),

            selfie: result.secure_url,

            location: {
                lat,
                lng
            }
        };

        // Calculate total hours
        const punchInTime =
            new Date(attendance.punchIn.time);

        const punchOutTime = new Date();

        const diffMs =
            punchOutTime - punchInTime;

        attendance.totalHours =
            diffMs / (1000 * 60 * 60);

        await attendance.save();

        res.status(200).json({
            success: true,
            message: "Punch out successful",
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const myAttendance = async (req, res) => {
    try {
        const attendance =
            await Attendance.find({
                userId: req.user.id
            }).sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const teamAttendance = async (req, res) => {
    try {
        let filter = {};

        // Manager sees only team
        if (req.user.role === "MANAGER") {
            const User = require("../users/user.model");

            const teamUsers = await User.find({
                managerId: req.user.id
            });

            const teamIds = teamUsers.map(
                (user) => user._id
            );

            filter.userId = {
                $in: teamIds
            };
        }

        const attendance =
            await Attendance.find(filter)
                .populate(
                    "userId",
                    "name phone role"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    punchIn,
    punchOut,
    myAttendance,
    teamAttendance
};