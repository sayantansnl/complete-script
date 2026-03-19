import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { middlewareHandleErrors, middlewareLogResponse, middlewareIncrementServerHits } from "./api/middleware.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerCreateUser } from "./api/users.js";
import { config } from "./config.js";
const migrationClient = postgres(config.dbConfig.dbUrl, { max: 1 });
await migrate(drizzle(migrationClient), config.dbConfig.migration);
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(middlewareLogResponse);
app.get("/admin/metrics", middlewareIncrementServerHits, handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.use(middlewareHandleErrors);
app.listen(PORT, () => {
    console.log(`Server listening on port:${8080}`);
});
