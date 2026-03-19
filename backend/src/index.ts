import express from "express";
import { 
    middlewareHandleErrors, 
    middlewareLogResponse,
    middlewareIncrementServerHits 
} from "./api/middleware.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";

const app = express();

const PORT = 8080;

app.use(middlewareLogResponse);

app.get("/api/metrics", middlewareIncrementServerHits, handlerMetrics);
app.get("/api/reset", handlerReset);

app.use(middlewareHandleErrors);

app.listen(PORT, () => {
    console.log(`Server listening on port:${8080}`);
});