import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Assuming user ID is stored in req.user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        res.ststus(200).json({
            message: "Users fetched successfully",
            users: filteredUsers,
        });
    } catch (error) {
        console.error("Error fetching users for sidebar:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
};