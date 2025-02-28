import User from "../models/user.model.js"
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No users found",
                status: 404,
                success: false
            });
        }
      // returing the response
        return res.status(200).json({
            success: true,
            users,  
            status: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            status: 500,
            success: false
        });
    }
};
