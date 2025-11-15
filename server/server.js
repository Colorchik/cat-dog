require('dotenv').config();
const express = require("express");
const serverConfig = require("./serverConfig");
const animalsRouter = require("./animals.router/animals.router");

const app = express();
serverConfig(app);

const PORT = process.env.PORT || 6001;
app.get("/api/status", (_, res) => {
    res.json({ message: 'ok' })
});

app.use("/api/animals", animalsRouter);

app.listen(PORT, () => {
    console.log("server started on port: ", PORT)
});