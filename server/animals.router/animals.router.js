const express = require("express");
const animalsRouter = express.Router();
const { Animals } = require("../db/models")

animalsRouter.get("/", (req, res) => {
    res.json({ message: "ok" })
});

animalsRouter.post("/favorites", async (req, res) => {
    try {
        const { imageURL, comment } = req.body;
        const newAnimal = await Animals.create({ imageURL, comment });
        res.status(201).json(newAnimal);
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
});

animalsRouter.get("/favorites", async (req, res) => {
    try {
        const animals = await Animals.findAll();
        res.json(animals);
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
});

module.exports = animalsRouter;