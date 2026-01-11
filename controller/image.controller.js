import User from "../db/models/users.js";
import Image from "../db/models/image.js";
import OpenRouterClient from "../services/ai/modelConfig.js";

export const generateImage = async (req, res) => {
    try {
        const { prompt, style, size, model, negativePrompt } = req.body;
        const userId = req.user.id;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        // Basic Safety Check (Mock)
        const bannedWords = ["nsfw", "nude", "naked", "violence", "blood"];
        const hasBannedWords = bannedWords.some(word => prompt.toLowerCase().includes(word));
        if (hasBannedWords) {
            return res.status(400).json({ message: "Prompt contains restricted content" });
        }

        // Check Credits
        const user = await User.findById(userId);
        if (user.credits < 1) {
            return res.status(403).json({ message: "Insufficient credits" });
        }


        const mockImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${size?.split('x')[0] || 1024}&height=${size?.split('x')[1] || 1024}&seed=${Math.floor(Math.random() * 1000)}`;

        // Deduct Credit
        user.credits -= 1;
        await user.save();

        // Save to History
        const newImage = await Image.create({
            userId,
            prompt,
            style,
            model,
            size,
            negativePrompt,
            imageUrl: mockImageUrl
        });

        res.status(200).json({
            message: "Image generated successfully",
            image: newImage,
            remainingCredits: user.credits
        });

    } catch (error) {
        console.error("Generate Image Error:", error);
        res.status(500).json({ message: "Failed to generate image" });
    }
};

export const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search, style } = req.query;

        let query = { userId };
        if (search) {
            query.prompt = { $regex: search, $options: 'i' };
        }
        if (style) {
            query.style = style;
        }

        const images = await Image.find(query).sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history" });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const image = await Image.findOneAndDelete({ _id: id, userId });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete image" });
    }
};

export const getCredits = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.status(200).json({ credits: user.credits });
    } catch (error) {
        res.status(500).json({ message: "Failed to get credits" });
    }
};

export const enhancePrompt = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: "Prompt is required" });

        const completion = await OpenRouterClient.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free", // Example free model
            messages: [
                {
                    role: "system",
                    content: "You are an expert AI art prompter. Enhance the following prompt with artistic details, lighting, and style keywords. Keep it concise."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const enhancedPrompt = completion.choices[0].message.content;

        res.status(200).json({ enhancedPrompt });
    } catch (error) {
        console.error("Enhance Prompt Error:", error);

        res.status(200).json({ enhancedPrompt: prompt + ", highly detailed, 8k, cinematic lighting" });
    }
};
