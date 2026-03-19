import express from "express";
import { middlewareHandleErrors, middlewareLogResponse } from "./api/middleware.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponse);
app.use(middlewareHandleErrors);
app.listen(PORT, () => {
    console.log(`Server listening on port:${8080}`);
});
