import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
export const getProfile = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No user found',
                status: 401
            });
        }
        
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false,
                status:404
            })
        }
        // Return user profile
        return res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
      
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message  
        });
    }
};



export const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Fetch user from the database using the user ID from JWT (req.user.id)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // If the name is provided, update it
        if (name) {
            user.name = name;
        }

      
        if (email) {
            const existingEmailUser = await User.findOne({ email });
            if (existingEmailUser && existingEmailUser._id !== user._id) {
                return res.status(400).json({
                    message: "Email is already taken",
                    success: false
                });
            }
            user.email = email;
        }

       
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

       
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};
