import { User } from "../models/userSchema.js";


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

        const user = new User({ name, email, password, profilePicture:profileImage });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
