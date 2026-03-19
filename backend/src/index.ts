import express from "express";
import { middlewareLogResponse } from "./api/middleware.js";

const app = express();

const PORT = 8080;

app.use(middlewareLogResponse);

app.listen(PORT, () => {
    console.log(`Server listening on port:${8080}`);
});