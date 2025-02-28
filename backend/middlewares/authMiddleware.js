
import jwt from 'jsonwebtoken';

// User authentication middleware 
export const authUser = async (req, res, next) => {
    try {
        // Access token from cookies
        const token = req.cookies.token;
       
        
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: No token provided',
                success: false,
                status: 401
            });
        }
       
       
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid or expired token',
                success: false,
                status: 401
            });
        }
       
        
        req.user = decoded;
        next();  // Move to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            status: 500,
            success: false,
            error:error
        });
    }
};

// Admin authentication middleware
export const authAdmin = async (req, res, next) => {
    try {     
        // Ensure the user is authenticated first
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized: User is not authenticated',
                success: false,
                status: 401
            });
        }

        // Check if the user has an admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Forbidden: You do not have admin privileges',
                success: false,
                status: 403
            });
        }

        // User is authenticated and an admin, proceed to the next middleware or route
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            status: 500,
            success: false,
            error:error
        });
    }
};

