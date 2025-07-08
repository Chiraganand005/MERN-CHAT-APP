import User from '../models/user.model.js';
import bcrypt from "bcryptjs"; // If using ES modules
import generateTokenandSetCookie from '../utils/generateToken.js';

export const signup = async(req, res) => {
    try{
        const { fullName, username, password,confirmPassword , gender } = req.body;

        if( password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const user = await User.findOne({ username });
        if(user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liaran.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;   
        
        // hash the password before saving
        const newUser = new User({  
            fullName,
            username,
            password, // You should hash this password before saving it
            gender,
            profilePic : gender === "male" ? boyProfilePic : girlProfilePic
        });
        if(newUser){
            generateTokenandSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({ 
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic});
        }else{
            res.status(400).json({ error: "User creation failed" });
        }

    } catch (error) {
        console.log("Error during signup:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    //console.log("User logged in:", req.body);
    try{
        const { username, password } = req.body;    
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        
        if(!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenandSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
    }catch(error){
        console.log("Error in login controllers", error.message);
        res.status(500).json({error : " internal server error"});
    }

};

export const logout = (req,res) => {
    //console.log("user logged out:", req.body);
    try{
        res.cookie("jwt","",{maxage: 0});
        res.status(200).json({ message: "User logged out successfully" });

    }catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({error : " internal server error"});
    }
}