import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local';
        },
        select: false
    },
    avatar: {
        type: String,
        default: ""
    },
    provider: {
        type: String,
        default: 'local'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    credits: {
        type: Number,
        default: 150
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
