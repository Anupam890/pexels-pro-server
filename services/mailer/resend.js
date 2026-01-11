import { Resend } from "resend";
import { verificationTemplate } from "./templates/verificationTemp.js";

const resend = new Resend("re_QaEEWWLV_LehFeY6sNxKwAP3kgJ9cgPnK");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email, token) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "info@thedigitalhubspot.com",
            to: email,
            subject: "Verify your email address",
            html: verificationTemplate(token)
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send verification email");
        }

        return data;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Password</h2>
                    <p>You requested a password reset. Click the link below to set a new password.</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
                    <p style="margin-top: 20px; color: #666;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send password reset email");
        }

        return data;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};

export default resend;
