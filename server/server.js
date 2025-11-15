require('dotenv').config();
const express = require("express");
const path = require("path");
const serverConfig = require("./serverConfig");
const animalsRouter = require("./animals.router/animals.router");

const app = express();
serverConfig(app);

// Health check endpoint
app.get("/api/status", (_, res) => {
    res.json({ message: 'ok' })
});

// API routes
app.use("/api/animals", animalsRouter);

// Serve static files from React app in production (must be after API routes)
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        }
    });
}

// Start server
const PORT = process.env.PORT || 6001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});