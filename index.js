import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/conn.js";
import authRoute from "./routes/auth.route.js";
import ImageRoute from "./routes/image.route.js";
import passport from "passport";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());
connectDB();
app.use('/auth', authRoute);
app.use('/generate', ImageRoute)

const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
