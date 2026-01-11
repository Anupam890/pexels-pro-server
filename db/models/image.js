import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    style: {
        type: String,
        default: "realistic"
    },
    model: {
        type: String,
        default: "stable-diffusion-xl"
    },
    size: {
        type: String,
        default: "1024x1024"
    },
    imageUrl: {
        type: String,
        required: true
    },
    negativePrompt: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);

export default Image;
