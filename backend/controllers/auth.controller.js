import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


// by this controller we can register user and admin
export const register = async (req, res) => {
    try {
        // Extracting user input (including role)
        const { name, email, password, role } = req.body;

        // If role is not provided, set default to 'user'
        const userRole = role || 'user';

        // Checking if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        // Validating required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Validating email format
        const regExpEmail = /^[^@]+@[^@]+\.[^@]+$/;
        if (!regExpEmail.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }

        // Validating password strength
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
                success: false
            });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        if(!process.env.JWT_SECRET){
            return res.status(500).json({
                message: "JWT_SECRET is not defined in the environment variables",
                success: false,
                error:error.message
            })
        }
        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole 
        });
         
        // Generate JWT Token
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }  // Token expires in 1 hour
        );
        
        // save the token in cookies
        res.cookie("token", token, {
            httpOnly:true,
            maxAge: 1000 * 60 * 60,
            
        })
        return res.status(201).json({
            message: "User created successfully",
            success: true,
            token,  // Send JWT token
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};


// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Checking if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                success: false
            });
        }

        // Checking if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            });
        }

        // Generating JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
      
        // saving the cookie
        res.cookie("token", token, {
            httpOnly:true,
            maxAge: 1000 * 60 * 60,
          
        })
        //returning the response
        return res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};


// Logout controller
export const logout = async (req, res) => {
    try {
        // Clear the JWT token cookie
        res.clearCookie('token', {
            httpOnly: true,  // ensureing cookie can't be accessed by JS
            
        });

        return res.status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};
