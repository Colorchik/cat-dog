const express = require("express");
const animalsRouter = express.Router();
const { Animals } = require("../db/models")

animalsRouter.get("/", (req, res) => {
    res.json({ message: "ok" })
});

animalsRouter.post("/favorites", async (req, res) => {
    try {
        const { imageURL, comment } = req.body;
        
        // Validate input
        if (!imageURL || typeof imageURL !== 'string') {
            return res.status(400).json({ error: 'imageURL is required and must be a string' });
        }
        
        // comment is optional, but if provided should be a string
        if (comment !== undefined && typeof comment !== 'string') {
            return res.status(400).json({ error: 'comment must be a string if provided' });
        }
        
        const newAnimal = await Animals.create({ imageURL, comment: comment || null });
        res.status(201).json(newAnimal);
    } catch(error) {
        console.error('Error creating favorite:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

animalsRouter.get("/favorites", async (req, res) => {
    try {
        const animals = await Animals.findAll();
        res.json(animals);
    } catch(error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

module.exports = animalsRouter;