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

// 404 handler for API routes (must be before SPA catch-all)
app.use((req, res, next) => {
    if (req.path.startsWith('/api') && req.method !== 'OPTIONS') {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    next();
});

// Serve static files from React app in production (must be after API routes)
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath));
    
    // Serve React app for all non-API routes (catch-all for SPA)
    app.use((req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api')) {
            return next();
        }
        // Send index.html for all other routes (SPA routing)
        const indexPath = path.join(clientBuildPath, 'index.html');
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('Error sending index.html:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    });
}

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS policy violation' });
    }
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error' 
    });
});

// Start server
const PORT = process.env.PORT || 6001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});