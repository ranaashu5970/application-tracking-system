import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const {
            userName,
            useremail,
            userpassword,
            gender,
            address,
            role,
            isAssigned,
            applications
        } = req.body;

        const existingUser = await User.findOne({ userEmail: useremail });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashPassword = await bcrypt.hash(userpassword, 10);

        const newUser = new User({
            userName,
            userEmail: useremail,
            userPassword: hashPassword,
            gender,
            address,
            role: role || "candidate",
            isAssigned: isAssigned || false,
            applications: applications || []
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { useremail, userpassword } = req.body;

        const user = await User.findOne({ userEmail: useremail });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(userpassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        res.status(200).json({ success: true, message: "Login successful", user, token });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { register, login, logout }