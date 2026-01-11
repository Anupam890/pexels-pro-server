import express from "express";
import passport from "passport";
import { register, login, googleAuth, googleAuthCallback } from '../controller/auth.controller.js'

const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', login);

// Google Routes
authRoute.get('/google', googleAuth);
authRoute.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleAuthCallback);

export default authRoute;
