const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
    // CORS configuration
    if (process.env.NODE_ENV === 'production') {
        // In production, only allow requests from FRONTEND_URL
        const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);
        app.use(cors({
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        }));
    } else {
        // In development, allow localhost origins
        app.use(cors({
            origin: ["http://localhost:3000", "http://localhost:5173"],
            credentials: true
        }));
    }

};