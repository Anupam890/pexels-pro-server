import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../db/models/users.js";
import { sendVerificationEmail } from "../services/mailer/resend.js";
import dotenv from "dotenv";
dotenv.config();


// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const email = profile.emails[0].value;
//         let user = await User.findOne({ email });

//         if (user) {
//             if (!user.googleId) {
//                 user.googleId = profile.id;
//                 user.provider = 'google';
//                 await user.save();
//             }
//             return done(null, user);
//         }

//         user = await User.create({
//             name: profile.displayName,
//             email: email,
//             googleId: profile.id,
//             provider: 'google',
//             isVerified: true,
//             avatar: profile.photos[0]?.value || ""
//         });

//         return done(null, user);
//     } catch (error) {
//         return done(error, null);
//     }
// }));


// export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// export const googleAuthCallback = (req, res) => {
//     const user = req.user;

//     res.status(200).json({
//         message: "Google Login successful",
//         user: {
//             id: user._id,
//             name: user.name,
//             email: user.email
//         }
//     });
// };

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" }); // Generic message for security
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};


export const forgotPassword = async (req, res) => {
    // Implement forgot password logic
};

export const logout = async (req, res) => {
    // Implement logout logic (if using cookies/sessions)
    res.status(200).json({ message: "Logged out successfully" });
};

